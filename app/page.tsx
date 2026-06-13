"use client";

import { useEffect, useState } from 'react';
import { 
  Container, Title, Text, Button, Group, Stack, SimpleGrid, Card, 
  AppShell, Burger, Box, ActionIcon, useMantineColorScheme, Badge, Drawer, Divider, TextInput, Textarea
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  'https://supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwaWtjdWRobGtieW5teWN0cmRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNjQ4OTEsImV4cCI6MjA5Njg0MDg5MX0.7e4JH1IJ2sxpRR2mDpVwAJ5lLQkx7h0IHZfMxYKnmU8'
);

interface ProductRow { title: string; price: number; description: string; image_url: string; }
interface CartItem extends ProductRow { quantity: number; }

export default function HomePage() {
  const [opened, { toggle }] = useDisclosure();
  const [cartOpened, { open: openCart, close: closeCart }] = useDisclosure(false);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const form = useForm({
    initialValues: { name: '', email: '', message: '' },
    validateInputOnChange: true,
    validate: {
      name: (value) => (value.trim().length < 2 ? 'Name must have at least 2 characters' : null),
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Invalid email address format'),
      message: (value) => (value.trim().length === 0 ? 'Message content cannot be empty' : null),
    },
  });

  useEffect(() => {
    async function loadProducts() {
      // Pass the matching client security token inside your reading stream
      const { data } = await supabase.from('products').select('*');
      if (data) setProducts(data);
    }
    loadProducts();
  }, []);

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
        alert('Failed to route email: ' + (data.error || 'Unknown error'));
      } else {
        setSuccess(true);
        form.reset();
      }
    } catch (err: any) {
      alert('Connection block: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: ProductRow) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.title === product.title);
      if (existing) {
        return prev.map((item) => item.title === product.title ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    openCart();
  };

  const removeFromCart = (title: string) => {
    setCart((prev) => prev.filter((item) => item.title !== title));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AppShell header={{ height: 60 }} navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }} padding="md">
      <AppShell.Header>
        <Container size="lg" h="100%">
          <Group justify="between" h="100%">
            <Text fw={900} size="xl" variant="gradient" gradient={{ from: 'violet.6', to: 'indigo.6' }}>MANTINE.io</Text>
            <Group gap="xl" visibleFrom="sm">
              <Text component="a" href="#" fw={500} size="sm" c="dimmed">Features</Text>
              <Text component="a" href="#catalog" fw={500} size="sm" c="dimmed">Store Catalog</Text>
              <Text component="a" href="#contact" fw={500} size="sm" c="dimmed">Contact</Text>
            </Group>
            <Group visibleFrom="sm">
              <ActionIcon onClick={() => toggleColorScheme()} variant="default" size="lg" radius="md">{isDark ? '☀️' : '🌙'}</ActionIcon>
              <Button onClick={openCart} variant="light" color="violet.6">🛒 Cart ({totalItems})</Button>
              <Button variant="default" component="a" href="/admin">Admin</Button>
            </Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack gap="md" style={{ width: '100%' }}>
          <Button variant="subtle" fullWidth onClick={openCart}>🛒 Open Cart ({totalItems})</Button>
          <Button variant="default" fullWidth component="a" href="/admin">Admin Panel</Button>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main pt={60}>
        <Container size="lg" py={60}>
          
          {/* Marketplace Title */}
          <Box id="catalog" style={{ marginTop: '20px' }}>
            <Box style={{ textAlign: 'center', marginBottom: '50px' }}>
              <Text component="h1" size="36px" fw={900} variant="gradient" gradient={{ from: 'violet.6', to: 'indigo.6' }}>
                Assorted Multi-Category Marketplace
              </Text>
              <Text c="dimmed" mt="xs">Streamed live from our secure PostgreSQL database rows.</Text>
            </Box>

            {products.length === 0 ? (
              <Card padding="xl" radius="lg" withBorder style={{ textAlign: 'center' }}>
                <Text c="dimmed">No products are currently active in our live catalog inventory store sheet.</Text>
              </Card>
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
                {products.map((product, idx) => (
                  <Card key={idx} shadow="sm" padding="xl" radius="lg" withBorder style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box style={{ width: '100%', height: '180px', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
                      <img src={product.image_url} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                    <Group justify="between" mb="xs">
                      <Text fw={700} size="sm" lineClamp={1}>{product.title}</Text>
                      <Badge color="green" size="lg" variant="light">${product.price}</Badge>
                    </Group>
                    <Text size="xs" c="dimmed" style={{ flexGrow: 1 }} lineClamp={2}>{product.description}</Text>
                    <Button fullWidth mt="xl" color="violet.6" radius="md" onClick={() => addToCart(product)}>Add to Cart</Button>
                  </Card>
                ))}
              </SimpleGrid>
            )}
          </Box>

          {/* Connected Email Contact Form Box Section */}
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

      <Drawer opened={cartOpened} onClose={closeCart} title="🛒 Your Shopping Cart" position="right" size="md" padding="xl">
        <Divider mb="xl" />
        {cart.length === 0 ? (
          <Box style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Text c="dimmed">Your shopping cart layout is currently empty.</Text>
          </Box>
        ) : (
          <Box style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 150px)', justifyContent: 'space-between' }}>
            <Box style={{ overflowY: 'auto', flexGrow: 1, paddingRight: '4px' }}>
              {cart.map((item, index) => (
                <Card key={index} withBorder mb="md" padding="sm" radius="md">
                  <Group justify="between">
                    <div style={{ maxWidth: '60%' }}>
                      <Text fw={600} size="sm" lineClamp={1}>{item.title}</Text>
                      <Text size="xs" c="dimmed">Qty: {item.quantity} × ${item.price}</Text>
                    </div>
                    <Group>
                      <Text fw={700} size="sm" c="violet.6">${item.price * item.quantity}</Text>
                      <Button size="xs" variant="subtle" color="red" onClick={() => removeFromCart(item.title)}>✕</Button>
                    </Group>
                  </Group>
                </Card>
              ))}
            </Box>
            <Box>
              <Divider my="md" />
              <Group justify="apart" align="center">
                <Text fw={700}>Total</Text>
                <Text fw={700}>${cartTotal.toFixed(2)}</Text>
              </Group>
              <Button fullWidth mt="md" color="violet.6" onClick={closeCart}>
                Proceed to Checkout
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>
    </AppShell>
  );
}

