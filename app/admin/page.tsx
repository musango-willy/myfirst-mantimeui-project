"use client";
// Force Next.js to fetch live database entries on every page request
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { 
  Container, Title, Text, Table, Button, Group, Card, SimpleGrid,
  Loader, Center, AppShell, ActionIcon, useMantineColorScheme, TextInput, NumberInput, Textarea
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { createClient } from '@supabase/supabase-js';

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
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  // Form handler for adding a new product listing
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
      fetchData(); // Refresh list automatically
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm('Delete this product?')) {
      await supabase.from('products').delete().eq('id', id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
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
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" mb="100px" style={{ alignItems: 'start' }}>
            {/* Left Column: Product Addition Form */}
            <Card padding="xl" radius="lg" withBorder shadow="sm">
              <Title order={2} size="22px" mb="md" fw={800}>📦 Add New Product Listing</Title>
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
              <Title order={2} size="22px" mb="md" fw={800}>📂 Live Inventory Catalog</Title>
              {products.length === 0 ? <Text c="dimmed" size="sm">No inventory records generated yet.</Text> : (
                <Table highlightOnHover verticalSpacing="sm">
                  <Table.Thead>
                    <Table.Tr><Table.Th>Product</Table.Th><Table.Th style={{ width: '80px' }}>Price</Table.Th><Table.Th style={{ width: '80px' }}>Action</Table.Th></Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {products.map((p) => (
                      <Table.Tr key={p.id}>
                        <Table.Td><Text fw={600} size="sm">{p.title}</Text><Text size="xs" c="dimmed" lineClamp={1}>{p.description}</Text></Table.Td>
                        <Table.Td fw={700} c="green.6">${p.price}</Table.Td>
                        <Table.Td><Button size="xs" color="red" variant="light" radius="md" onClick={() => handleDeleteProduct(p.id)}>Delete</Button></Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              )}
            </Card>
          </SimpleGrid>

          {/* Customer Leads Log Section at the Bottom */}
          <Title order={2} size="24px" mb="md" fw={800}>✉️ Customer Leads Log</Title>
          {loading ? <Loader size="sm" /> : (
            <Card padding={0} radius="lg" withBorder shadow="xs" style={{ overflow: 'hidden' }}>
              <Table highlightOnHover verticalSpacing="md" horizontalSpacing="lg">
                <Table.Thead style={{ backgroundColor: isDark ? 'var(--mantine-color-dark-6)' : 'var(--mantine-color-gray-0)' }}>
                  <Table.Tr><Table.Th>Sender</Table.Th><Table.Th>Email Address</Table.Th><Table.Th>Inquiry Content Message</Table.Th></Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {messages.map((msg) => (
                    <Table.Tr key={msg.id}>
                      <Table.Td fw={600}>{msg.name}</Table.Td>
                      <Table.Td c="blue">{msg.email}</Table.Td>
                      <Table.Td>{msg.message}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Card>
          )}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
