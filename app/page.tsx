"use client";

import { useEffect, useState } from 'react';
import { 
  Container, Title, Text, Button, Group, SimpleGrid, Card, 
  AppShell, Burger, Box, ActionIcon, useMantineColorScheme, TextInput, Textarea
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
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  // Form state tracking setup with live field data validation rules
  const form = useForm({
    initialValues: { name: '', email: '', message: '' },
    validate: {
      name: (value) => (value.trim().length < 2 ? 'Name must have at least 2 characters' : null),
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Invalid email address format'),
      message: (value) => (value.trim().length === 0 ? 'Message content cannot be empty' : null),
    },
  });

  // Pull product details from your cloud database sheets automatically
  useEffect(() => {
    async function loadProducts() {
      try {
        const { data } = await supabase.from('products').select('*');
        if (data) setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    }
    loadProducts();
  }, []);

  // 1. THE SUBMISSION LOOP: Transmits form entries straight to your secure Resend Email API node
  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        alert('Failed to route email: ' + (data.error || 'Unknown network error'));
      } else {
        setSuccess(true);
        form.reset();
      }
    } catch (err: any) {
      alert('Connection block intercepted request: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell header={{ height: 60 }} navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }} padding="md">
      <AppShell.Header>
        <Container size="lg" h="100%">
          <Group justify="between" h="100%">
            <Text fw={900} size="xl" variant="gradient" gradient={{ from: 'violet.6', to: 'indigo.6' }}>MANTINE.io</Text>
            
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
          <Button variant="subtle" fullWidth color="gray" component="a" href="#contact">Contact</Button>
          <Button variant="default" fullWidth component="a" href="/admin">Admin Panel</Button>
        </Group>
      </AppShell.Navbar>

      <AppShell.Main pt={60}>
        <Container size="lg" py={60}>
          
          {/* Hero Section */}
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50} style={{ alignItems: 'center' }} mb="80px">
            <div>
              <Title order={1} size="calc(2rem + 1.5vw)" fw={900} lh={1.2}>
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
          <Box id="catalog" style={{ marginTop: '80px', marginBottom: '100px' }}>
            <Box style={{ textAlign: 'center', marginBottom: '50px' }}>
              <Title order={2} size="32px" fw={800}>Explore Our Available Products</Title>
              <Text c="dimmed" mt="sm">Directly powered by our custom Postgres database catalog backend.</Text>
            </Box>

            {products.length === 0 ? (
              <Card padding="xl" radius="lg" withBorder style={{ textAlign: 'center' }}>
                <Text c="dimmed">No products are currently active in our live catalog catalog inventory store sheet.</Text>
              </Card>
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
                {products.map((product, idx) => (
                  <Card key={idx} shadow="sm" padding="xl" radius="lg" withBorder style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box style={{ width: '100%', height: '200px', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
                      <img src={product.image_url} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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

          {/* 2. Connected Email Contact Form Box Section */}
          <Box id="contact" style={{ marginTop: '100px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            <Box style={{ textAlign: 'center', marginBottom: '30px' }}>
              <Title order={2} size="32px" fw={800}>Get in Touch</Title>
              <Text c="dimmed" mt="sm">Have questions? Send us an inquiry to route directly to our personal email.</Text>
            </Box>

            <Card padding="xl" radius="lg" withBorder shadow="sm">
              <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput label="Your Name" placeholder="John Doe" required {...form.getInputProps('name')} disabled={loading} />
                <TextInput label="Email Address" placeholder="hello@example.com" required mt="md" {...form.getInputProps('email')} disabled={loading} />
                <Textarea label="Your Message" placeholder="Tell us about your project requirements..." required mt="md" minRows={4} {...form.getInputProps('message')} disabled={loading} />

                {success && <Text c="green" size="sm" mt="sm" fw={500}>✓ Message sent successfully! Check your automated Resend email inbox logs.</Text>}

                <Button type="submit" fullWidth mt="xl" size="md" color="violet.6" loading={loading}>
                  {loading ? 'Sending Email Routing...' : 'Send Message'}
                </Button>
              </form>
            </Card>
          </Box>

        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
