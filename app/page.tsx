"use client";

import { useEffect, useState } from 'react';
import { 
  Container, Title, Text, Button, Group, SimpleGrid, Card, Image,
  ThemeIcon, AppShell, Burger, TextInput, Textarea, Box, ActionIcon, useMantineColorScheme, Loader, Center
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { createClient } from '@supabase/supabase-js';

// Force Next.js to skip caching and fetch live entries on every page view
export const dynamic = 'force-dynamic';

// Secure database connection client
const supabase = createClient(
  'https://supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwaWtjdWRobGtieW5teWN0cmRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNjQ4OTEsImV4cCI6MjA5Njg0MDg5MX0.7e4JH1IJ2sxpRR2mDpVwAJ5lLQkx7h0IHZfMxYKnmU8'
);

interface ProductRow {
  id: number;
  title: string;
  price: number;
  description: string;
  image_url: string;
}

export default function HomePage() {
  const [opened, { toggle }] = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [products, setProducts] = useState<ProductRow[]>([]);
  
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  // 1. Fetch live products from Supabase
  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      setProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Contact Form configuration
  const form = useForm({
    validateInputOnChange: true,
    initialValues: { name: '', email: '', message: '' },
    validate: {
      name: (value) => (value.trim().length < 2 ? 'Name must have at least 2 characters' : null),
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Invalid email address format'),
      message: (value) => (value.trim().length === 0 ? 'Message content cannot be empty' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setFormLoading(true);
    setSuccess(false);

    const { error } = await supabase
      .from('contact_messages')
      .insert([{ name: values.name, email: values.email, message: values.message }]);

    setFormLoading(false);

    if (error) {
      alert('Failed to send message: ' + error.message);
    } else {
      setSuccess(true);
      form.reset();
    }
  };

  return (
    <AppShell header={{ height: 60 }} navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }} padding="md">
      {/* Global Header Bar */}
      <AppShell.Header>
        <Container size="lg" h="100%">
          <Group justify="between" h="100%">
            <Text fw={900} size="xl" variant="gradient" gradient={{ from: 'violetBrand.6', to: 'indigo.6' }}>MANTINE.io</Text>
            
            <Group gap="xl" visibleFrom="sm">
              <Text component="a" href="#features" fw={500} size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Features</Text>
              <Text component="a" href="#products" fw={500} size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Products</Text>
              <Text component="a" href="#pricing" fw={500} size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Pricing</Text>
              <Text component="a" href="#contact" fw={500} size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Contact</Text>
            </Group>

            <Group visibleFrom="sm">
              <ActionIcon onClick={() => toggleColorScheme()} variant="default" size="lg" radius="md">
                {isDark ? '☀️' : '🌙'}
              </ActionIcon>
              <Button variant="default">Log In</Button>
              <Button gradient={{ from: 'violetBrand.6', to: 'indigo.6' }} variant="gradient">Get Started</Button>
            </Group>

            <Group hiddenFrom="sm">
              <ActionIcon onClick={() => toggleColorScheme()} variant="default" size="lg" radius="md" mr="xs">
                {isDark ? '☀️' : '🌙'}
              </ActionIcon>
              <Burger opened={opened} onClick={toggle} size="sm" />
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Box style={{ width: '100%', display: 'grid', gap: '16px' }}>
          <Button variant="subtle" fullWidth color="gray" component="a" href="#features">Features</Button>
          <Button variant="subtle" fullWidth color="gray" component="a" href="#products">Products</Button>
          <Button variant="subtle" fullWidth color="gray" component="a" href="#pricing">Pricing</Button>
          <Button variant="subtle" fullWidth color="gray" component="a" href="#contact">Contact</Button>
          <Button variant="default" fullWidth mt="md">Log In</Button>
          <Button gradient={{ from: 'violetBrand.6', to: 'indigo.6' }} variant="gradient" fullWidth>Get Started</Button>
        </Box>
      </AppShell.Navbar>

      <AppShell.Main pt={60}>
        <Container size="lg" py={60}>
          
          {/* Hero Section */}
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50} style={{ alignItems: 'center' }}>
            <div>
              <Title
                order={1}
                size="calc(2rem + 1.5vw)"
                fw={900}
                lh={1.2}
                style={{
                  background: 'linear-gradient(90deg, #7C3AED, #4F46E5)',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                Automate your workflow in a single click.
              </Title>
              <Text c="dimmed" size="lg" mt="xl">
                Stop wasting hours on manual data entry. Our platform connects your favorite software pipeline seamlessly so you can focus on building your actual product.
              </Text>
              <Group mt={40}>
                <Button size="lg" gradient={{ from: 'violetBrand.6', to: 'indigo.6' }} variant="gradient">Start free trial</Button>
                <Button size="lg" variant="outline" color="violetBrand.6">Book a live demo</Button>
              </Group>
            </div>
            <div style={{ height: '380px', backgroundColor: isDark ? 'var(--mantine-color-dark-6)' : 'var(--mantine-color-gray-1)', borderRadius: '24px', border: '1px dashed var(--mantine-color-gray-4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text c="gray.5" fw={500}>[ Product Dashboard Mockup Preview ]</Text>
            </div>
          </SimpleGrid>

          {/* Features Grid Section */}
          <div id="features" style={{ marginTop: '120px' }}>
            <div style={{ marginBottom: '50px', textAlign: 'center' }}>
              <Title order={2} size="32px" fw={800}>Everything you need to scale</Title>
              <Text c="dimmed" mt="sm" maw={600} mx="auto">Our platform includes all the enterprise-ready infrastructure integrations out of the box.</Text>
            </div>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
              <Card shadow="sm" padding="xl" withBorder>
                <ThemeIcon variant="light" size="xl" radius="md" color="violetBrand.6">⚡</ThemeIcon>
                <Text fw={700} size="lg" mt="md">Real-time Analytics</Text>
                <Text size="sm" c="dimmed" mt="sm" lh={1.5}>Track performance metrics immediately as they happen. Never make decisions blindly again.</Text>
              </Card>
              <Card shadow="sm" padding="xl" withBorder>
                <ThemeIcon variant="light" size="xl" radius="md" color="violetBrand.4">🔒</ThemeIcon>
                <Text fw={700} size="lg" mt="md">Secure Encryption</Text>
                <Text size="sm" c="dimmed" mt="sm" lh={1.5}>Your data is fully encrypted both in transit and at rest with bank-grade security protocols.</Text>
              </Card>
              <Card shadow="sm" padding="xl" withBorder>
                <ThemeIcon variant="light" size="xl" radius="md" color="indigo.6">⚙️</ThemeIcon>
                <Text fw={700} size="lg" mt="md">Easy Integrations</Text>
                <Text size="sm" c="dimmed" mt="sm" lh={1.5}>Connect seamlessly to Slack, Discord, GitHub, and over 2,000 other apps using our visual builder.</Text>
              </Card>
            </SimpleGrid>
          </div>

          {/* NEW FEATURE: Dynamic Products Catalog Section */}
          <div id="products" style={{ marginTop: '120px' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <Title order={2} size="32px" fw={800}>Explore Our Available Products</Title>
              <Text c="dimmed" mt="sm" maw={600} mx="auto">Directly powered by our custom Postgres database catalog backend.</Text>
            </div>

            {loading ? (
              <Center py="xl"><Group gap="xs"><Loader size="sm" /><Text c="dimmed" size="sm">Loading catalog items...</Text></Group></Center>
            ) : products.length === 0 ? (
              <Card padding="xl" radius="lg" withBorder shadow="sm" style={{ textAlign: 'center' }}>
                <Text c="dimmed">No products are currently active in our live catalog inventory store sheet.</Text>
              </Card>
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
                {products.map((p) => (
                  <Card key={p.id} shadow="sm" padding="md" radius="lg" withBorder style={{ display: 'flex', flexDirection: 'column', justifyContent: 'between' }}>
                    <Card.Section>
                      <Image 
                        src={p.image_url || 'https://unsplash.com'} 
                        height={200} 
                        alt={p.title} 
                      />
                    </Card.Section>
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
                    
