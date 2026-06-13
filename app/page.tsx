"use client";

import { useEffect, useState } from 'react';
import { 
  Container, Title, Text, Button, Group, SimpleGrid, Card, 
  AppShell, Burger, TextInput, Textarea, Box, ActionIcon, useMantineColorScheme 
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  'https://supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwaWtjdWRobGtieW5teWN0cmRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNjQ4OTEsImV4cCI6MjA5Njg0MDg5MX0.7e4JH1IJ2sxpRR2mDpVwAJ5lLQkx7h0IHZfMxYKnmU8'
);

interface ProductRow {
  title: string;
  price: number;
  description: string;
  image_url: string;
}

export default function HomePage() {
  const [opened, { toggle }] = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [products, setProducts] = useState<ProductRow[]>([]);
  
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const form = useForm({
    initialValues: { name: '', email: '', message: '' },
    validate: {
      name: (value) => (value.trim().length < 2 ? 'Name must have at least 2 characters' : null),
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Invalid email address format'),
      message: (value) => (value.trim().length === 0 ? 'Message content cannot be empty' : null),
    },
  });

  useEffect(() => {
    async function loadProducts() {
      const { data } = await supabase.from('products').select('*');
      if (data) setProducts(data);
    }
    loadProducts();
  }, []);

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    setSuccess(false);
    const { error } = await supabase.from('contact_messages').insert([values]);
    setLoading(false);
    if (error) alert('Failed to send message: ' + error.message);
    else { setSuccess(true); form.reset(); }
  };

  return (
    <AppShell header={{ height: 60 }} navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }} padding="md">
      <AppShell.Header>
        <Container size="lg" h="100%">
          <Group justify="between" h="100%">
            <Text fw={900} size="xl" variant="gradient" gradient={{ from: 'violetBrand.6', to: 'indigo.6' }}>MANTINE.io</Text>
            <Group gap="xl" visibleFrom="sm">
              <Text component="a" href="#" fw={500} size="sm" c="dimmed">Features</Text>
              <Text component="a" href="#catalog" fw={500} size="sm" c="dimmed">Products</Text>
              <Text component="a" href="#contact" fw={500} size="sm" c="dimmed">Contact</Text>
            </Group>
            <Group visibleFrom="sm">
              <ActionIcon onClick={() => toggleColorScheme()} variant="default" size="lg" radius="md">
                {isDark ? '☀️' : '🌙'}
              </ActionIcon>
              <Button variant="default" component="a" href="/admin">Admin Panel</Button>
            </Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Group gap="md" style={{ width: '100%', flexDirection: 'column' }}>
          <Button variant="subtle" fullWidth color="gray" component="a" href="#catalog">Products</Button>
          <Button variant="default" fullWidth component="a" href="/admin">Admin Panel</Button>
        </Group>
      </AppShell.Navbar>

      <AppShell.Main pt={60}>
        <Container size="lg" py={60}>
          {/* Dynamic Product Catalog Section */}
          <div id="catalog" style={{ marginTop: '40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <Title order={2} size="32px" fw={800}>Explore Our Available Products</Title>
              <Text ta="center" c="dimmed" mt="sm">Directly powered by our custom Postgres database catalog backend.</Text>
            </div>

            {products.length === 0 ? (
              <Card padding="xl" radius="lg" withBorder style={{ textAlign: 'center' }}>
                <Text c="dimmed">No products are currently active in our live catalog inventory store sheet.</Text>
              </Card>
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
                {products.map((product, idx) => (
                  <Card key={idx} shadow="sm" padding="xl" radius="lg" withBorder style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ width: '100%', height: '200px', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
                      <img src={product.image_url} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <Group justify="between" mt="md" mb="xs">
                      <Text fw={700} size="lg">{product.title}</Text>
                      <Text fw={800} c="green.6" size="lg">${product.price}</Text>
                    </Group>
                    <Text size="sm" c="dimmed" mt="xs" style={{ flexGrow: 1 }}>{product.description}</Text>
                    <Button fullWidth mt="xl" color="violetBrand.6" radius="md">Buy Now</Button>
                  </Card>
                ))}
              </SimpleGrid>
            )}
          </div>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
