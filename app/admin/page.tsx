"use client";

import { useEffect, useState } from 'react';
import { 
  Container, Title, Text, Button, Group, Card, SimpleGrid,
  Loader, Center, AppShell, ActionIcon, useMantineColorScheme, TextInput, NumberInput, Textarea
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { createClient } from '@supabase/supabase-js';

// Secure database connection client matching your project cluster
const supabase = createClient(
  'https://supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwaWtjdWRobGtieW5teWN0cmRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNjQ4OTEsImV4cCI6MjA5Njg0MDg5MX0.7e4JH1IJ2sxpRR2mDpVwAJ5lLQkx7h0IHZfMxYKnmU8'
);

interface MessageRow { id: number; name: string; email: string; message: string; created_at: string; }
interface ProductRow { id: number; title: string; price: number; description: string; }

export default function AdminPage() {
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingProduct, setAddingProduct] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const productForm = useForm({
    initialValues: { title: '', price: 29, description: '' },
    validate: {
      title: (val) => (val.trim().length < 2 ? 'Title is required' : null),
      description: (val) => (val.trim().length === 0 ? 'Description is required' : null),
    }
  });

  const fetchData = async () => {
    setLoading(true);
    const msgsRes = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    const prodsRes = await supabase.from('products').select('*').order('created_at', { ascending: false });
    
    if (msgsRes.data) setMessages(msgsRes.data);
    if (prodsRes.data) setProducts(prodsRes.data);
    setLoading(false);
  };

  const handleAddProduct = async (values: typeof productForm.values) => {
    setAddingProduct(true);
    const { error } = await supabase.from('products').insert([values]);
    setAddingProduct(false);

    if (error) {
      alert('Failed to save product: ' + error.message);
    } else {
      productForm.reset();
      fetchData();
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm('Delete this product?')) {
      await supabase.from('products').delete().eq('id', id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleDeleteMessage = async (id: number) => {
    if (!confirm('Permanently delete this message log?')) return;
    setDeletingId(id);
    await supabase.from('contact_messages').delete().eq('id', id);
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
    setDeletingId(null);
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Container size="lg" h="100%">
          <Group justify="between" h="100%">
            <Text fw={900} size="xl" variant="gradient" gradient={{ from: 'violetBrand.6', to: 'indigo.6' }}>MANTINE Admin</Text>
            <Group>
              <Button variant="subtle" size="sm" component="a" href="/">Back to Site</Button>
              <ActionIcon onClick={() => toggleColorScheme()} variant="default" size="lg" radius="md">{isDark ? '☀️' : '🌙'}</ActionIcon>
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main pt={80}>
        <Container size="lg">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" mb="50px" style={{ alignItems: 'start' }}>
            {/* Left Column: Product Addition Form */}
            <Card padding="xl" radius="lg" withBorder shadow="sm">
              <Title order={2} size="20px" mb="md" fw={800}>📦 Add New Product Listing</Title>
              <form onSubmit={productForm.onSubmit(handleAddProduct)}>
                <TextInput label="Product Name" placeholder="e.g. Wireless Headphones Pro" required {...productForm.getInputProps('title')} />
                <NumberInput label="Price (USD)" placeholder="29" min={1} required mt="md" {...productForm.getInputProps('price')} />
                <Textarea label="Short Description" placeholder="Describe core parameters..." required mt="md" minRows={3} {...productForm.getInputProps('description')} />
                <Button type="submit" fullWidth mt="xl" gradient={{ from: 'violetBrand.6', to: 'indigo.6' }} variant="gradient" loading={addingProduct}>
                  Save Product to Catalog
                </Button>
              </form>
            </Card>

            {/* Right Column: Inventory Data Grid */}
            <Card padding="xl" radius="lg" withBorder shadow="sm">
              <Title order={2} size="20px" mb="md" fw={800}>📂 Live Inventory Catalog</Title>
              {products.length === 0 ? <Text c="dimmed" size="sm">No inventory records generated yet.</Text> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {products.map((p) => (
                    <Card key={p.id} withBorder padding="sm" radius="md" style={{ backgroundColor: isDark ? 'var(--mantine-color-dark-6)' : 'var(--mantine-color-gray-0)' }}>
                      <Group justify="between">
                        <div style={{ maxWidth: '70%' }}>
                          <Text fw={600} size="sm">{p.title}</Text>
                          <Text size="xs" c="dimmed" lineClamp={1}>{p.description}</Text>
                        </div>
                        <Group>
                          <Text fw={700} c="green.6" size="sm">${p.price}</Text>
                          <Button size="xs" color="red" variant="light" radius="md" onClick={() => handleDeleteProduct(p.id)}>Delete</Button>
                        </Group>
                      </Group>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </SimpleGrid>

          {/* Customer Leads Log Section */}
          <Title order={2} size="22px" mb="md" fw={800}>✉️ Customer Leads Log</Title>
          {loading ? <Center py="xl"><Loader size="sm" /></Center> : messages.length === 0 ? (
            <Text c="dimmed" size="sm">No custom submissions found.</Text>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {messages.map((msg) => (
                <Card key={msg.id} padding="xl" radius="lg" withBorder shadow="xs">
                  <Group justify="between" mb="xs">
                    <div>
                      <Text fw={700} size="sm">{msg.name}</Text>
                      <Text size="xs" c="blue">{msg.email}</Text>
                    </div>
                    <Button size="xs" color="red" variant="light" radius="md" loading={deletingId === msg.id} onClick={() => handleDeleteMessage(msg.id)}>
                      Delete Message
                    </Button>
                  </Group>
                  <Text size="sm" style={{ whiteSpace: 'pre-wrap' }} c="gray.7">{msg.message}</Text>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
