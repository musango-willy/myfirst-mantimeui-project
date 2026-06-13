"use client";

import { useEffect, useState } from 'react';
import { 
  Container, Title, Text, Button, Group, SimpleGrid, Card, 
  AppShell, Burger, Box, ActionIcon, useMantineColorScheme 
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
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
  const [products, setProducts] = useState<ProductRow[]>([]);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    async function loadProducts() {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (error) {
          console.error("Database fetch error:", error.message);
          return;
        }
        if (data) setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    }
    loadProducts();
  }, []);

  return (
    <AppShell header={{ height: 60 }} navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }} padding="md">
      <AppShell.Header>
        <Container size="lg" h="100%">
          <Group justify="between" h="100%">
            <Text fw={900} size="xl" variant="gradient" gradient={{ from: 'violet.6', to: 'indigo.6' }}>MANTINE.io</Text>
            
            <Group gap="xl" visibleFrom="sm">
              <Text component="a" href="#" fw={500} size="sm" c="dimmed">Features</Text>
              <Text component="a" href="#catalog" fw={500} size="sm" c="dimmed">Products</Text>
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
        <Box style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Button variant="subtle" fullWidth color="gray" component="a" href="#catalog">Products</Button>
          <Button variant="default" fullWidth component="a" href="/admin">Admin Panel</Button>
        </Box>
      </AppShell.Navbar>

      <AppShell.Main pt={60}>
        <Container size="lg" py={60}>
          
          {/* Hero Section */}
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50} style={{ alignItems: 'center' }} mb="80px">
            <div>
              <Title
                size="calc(2rem + 1.5vw)"
                fw={900}
                lh={1.2}
                style={{
                  backgroundImage: 'linear-gradient(90deg, var(--mantine-color-violet-6), var(--mantine-color-indigo-6))',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                Automate your workflow in a single click.
              </Title>
              <Text c="dimmed" size="lg" mt="xl">
                Stop wasting hours on manual data entry. Our platform connects your favorite software pipeline seamlessly so you can focus on building your actual product.
              </Text>
            </div>
            <Box style={{ height: '300px', backgroundColor: isDark ? 'var(--mantine-color-dark-6)' : 'var(--mantine-color-gray-1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text c="gray.5" fw={500}>[ Product Dashboard Mockup Preview ]</Text>
            </Box>
          </SimpleGrid>

          {/* Dynamic Product Catalog Section */}
          <Box id="catalog" style={{ marginTop: '80px' }}>
            <Box style={{ textAlign: 'center', marginBottom: '50px' }}>
              <Title order={2} size="32px" fw={800}>Explore Our Available Products</Title>
              <Text c="dimmed" mt="sm">Directly powered by our custom Postgres database catalog backend.</Text>
            </Box>

            {!products || products.length === 0 ? (
              <Card padding="xl" radius="lg" withBorder style={{ textAlign: 'center' }}>
                <Text c="dimmed">No products are currently active in our live catalog inventory store sheet.</Text>
              </Card>
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
                {products.map((product, idx) => (
                  <Card key={idx} shadow="sm" padding="xl" radius="lg" withBorder style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box style={{ width: '100%', height: '200px', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
                      <img 
                        src={product.image_url || 'https://unsplash.com'} 
                        alt={product.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </Box>
                    <Group justify="between" mt="md" mb="xs">
                      <Text fw={700} size="sm">{product.title}</Text>
                      <Text fw={800} c="green.6" size="sm">${product.price}</Text>
                    </Group>
                    <Text size="xs" c="dimmed" mt="xs" style={{ flexGrow: 1 }}>{product.description}</Text>
                    <Button fullWidth mt="xl" color="violet.6" radius="md">Buy Now</Button>
                  </Card>
                ))}
              </SimpleGrid>
            )}
          </Box>

        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
