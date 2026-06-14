"use client";

import { useEffect, useState } from 'react';
import { 
  Container, Title, Text, Button, Group, SimpleGrid, Card, 
  AppShell, Burger, Box, ActionIcon, useMantineColorScheme, 
  Drawer, Divider, Badge, TextInput, Textarea, Stack, Center
} from '@mantine/core'; // <-- FIXED: Added missing Stack and Textarea component wrappers
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  'https://supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwaWtjdWRobGtieW5teWN0cmRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNjQ4OTEsImV4cCI6MjA5Njg0MDg5MX0.7e4JH1IJ2sxpRR2mDpVwAJ5lLQkx7h0IHZfMxYKnmU8'
);

const FALLBACK_PRODUCTS = [
  { title: 'Pro Wireless Headphones', price: 99, description: 'Active noise-cancelling over-ear layout with a 40-hour runtime.', image_url: 'https://unsplash.com' },
  { title: 'Mechanical Gaming Keyboard', price: 129, description: 'RGB backlit mechanical frame featuring hot-swappable brown switches.', image_url: 'https://unsplash.com' },
  { title: 'Ergonomic Wireless Mouse', price: 59, description: 'Precision tracking multi-surface optical layout with programmable nodes.', image_url: 'https://unsplash.com' },
  { title: 'Ultra-Wide 4K Monitor', price: 449, description: '34-inch curved productivity screen featuring a crisp IPS color panel.', image_url: 'https://unsplash.com' },
  { title: 'Portable Bluetooth Speaker', price: 79, description: 'IPX7 waterproof construction with loud omnidirectional acoustics.', image_url: 'https://unsplash.com' },
  { title: 'Classic Denim Jacket', price: 85, description: 'Premium raw cotton indigo layout with tailored button closures.', image_url: 'https://unsplash.com' },
  { title: 'Minimalist Leather Sneakers', price: 120, description: 'Full-grain leather uppers sitting on durable vulcanized rubber soles.', image_url: 'https://unsplash.com' },
  { title: 'Heavyweight Cotton Hoodie', price: 65, description: 'Thick loopback terry cloth construction finished with dynamic relaxed fit.', image_url: 'https://unsplash.com' },
  { title: 'Mid-Century Modern Sofa', price: 899, description: 'Deep-cushioned upholstery supported by tapered solid walnut legs.', image_url: 'https://unsplash.com' },
  { title: 'Minimalist Oak Desk', price: 349, description: 'Spacious computer desk workspace complete with discrete cable slots.', image_url: 'https://unsplash.com' },
  { title: 'Ergonomic Office Chair', price: 280, description: 'High-back mesh support frame layered with multi-axis arm adjustment points.', image_url: 'https://unsplash.com' }
];

interface ProductRow { title: string; price: number; description: string; image_url: string; }
interface CartItem extends ProductRow { quantity: number; }

export default function HomePage() {
  const [opened, { toggle }] = useDisclosure();
  const [cartOpened, { open: openCart, close: closeCart }] = useDisclosure(false);
  const [products, setProducts] = useState<ProductRow[]>(FALLBACK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const form = useForm({
    validateInputOnChange: true,
    initialValues: { name: '', email: '', message: '' },
    validate: {
      name: (value) => (value.trim().length < 2 ? 'Name must have at least 2 characters' : null),
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Invalid email address format'),
      message: (value) => (value.trim().length === 0 ? 'Message content cannot be empty' : null),
    },
  });

  useEffect(() => {
    async function loadProducts() {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (!error && data && data.length > 0) setProducts(data);
      } catch (err) {
        console.log("Database fetch offline. Using stable internal cache.");
      }
    }
    loadProducts();
  }, []);

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

  const handleCheckoutRedirect = async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems: cart }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Stripe configuration error: ' + (data.error || 'Failed to initialize gateway'));
      }
    } catch (err: any) {
      alert('Network routing failed: ' + err.message);
    }
  };

  const handleInquirySubmit = async (values: typeof form.values) => {
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
        alert('Email routing failure: ' + (data.error || 'Check Resend console log keys'));
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

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AppShell header={{ height: 60 }} navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }} padding="md">
      <AppShell.Header>
        <Container size="lg" h="100%">
          <Group justify="between" h="100%">
            <Text fw={900} size="xl" variant="gradient" gradient={{ from: 'violet.6', to: 'indigo.6' }}>MANTINE.io</Text>
            <Group gap="xl" visibleFrom="sm">
              <Text component="a" href="#catalog" fw={500} size="sm" c="dimmed">Store Catalog</Text>
              <Text component="a" href="#contact" fw={500} size="sm" c="dimmed">Get In Touch</Text>
            </Group>
            <Group visibleFrom="sm">
              <ActionIcon onClick={() => toggleColorScheme()} variant="default" size="lg" radius="md">
                {isDark ? '☀️' : '🌙'}
              </ActionIcon>
              <Button onClick={openCart} variant="light" color="violet.6">🛒 Cart ({totalItems})</Button>
              <Button variant="default" component="a" href="/admin">Admin</Button>
            </Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Navbar p="md" style={{ zIndex: 999 }}>
        <Stack gap="md">
          <Button variant="subtle" fullWidth onClick={openCart}>🛒 Open Cart ({totalItems})</Button>
          <Button variant="default" fullWidth component="a" href="/admin">Admin Panel</Button>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main pt={80} style={{ position: 'relative', zIndex: 10 }}>
        <Container size="lg" py={40}>
          
          {/* Storefront Section */}
          <Box id="catalog" style={{ scrollMarginTop: '80px', marginBottom: '100px' }}>
            <Box style={{ textAlign: 'center', marginBottom: '50px' }}>
              <Text component="h1" size="36px" fw={900} variant="gradient" gradient={{ from: 'violet.6', to: 'indigo.6' }}>
                Assorted Multi-Category Marketplace
              </Text>
              <Text c="dimmed" mt="xs">Streamed live from our secure PostgreSQL database rows.</Text>
            </Box>

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
          </Box>

          <Divider my="xl" />

          {/* Contact Section */}
          <Box id="contact" style={{ scrollMarginTop: '80px', maxWidth: '600px', margin: '0 auto' }}>
            <Box style={{ textAlign: 'center', marginBottom: '40px' }}>
              <Title order={2} size="28px" fw={900}>Get In Touch</Title>
              <Text c="dimmed" mt="xs">We'd love to hear from you. Send us your inquiry.</Text>
            </Box>

            {success && <Badge color="green" fullWidth mb="md">Message sent successfully! We'll respond soon.</Badge>}

            <form onSubmit={form.onSubmit(handleInquirySubmit)}>
              <Stack gap="md">
                <TextInput
                  label="Your Name"
                  placeholder="John Doe"
                  {...form.getInputProps('name')}
                />
                <TextInput
                  label="Email Address"
                  placeholder="john@example.com"
                  {...form.getInputProps('email')}
                />
                <Textarea
                  label="Message"
                  placeholder="Tell us what you're thinking..."
                  minRows={4}
                  {...form.getInputProps('message')}
                />
                <Button type="submit" color="violet.6" loading={loading} fullWidth>
                  Send Inquiry
                </Button>
              </Stack>
            </form>
          </Box>
        </Container>
      </AppShell.Main>

      {/* Cart Drawer */}
      <Drawer opened={cartOpened} onClose={closeCart} title="Shopping Cart" position="right" size="md">
        {cart.length === 0 ? (
          <Center h={200}>
            <Text c="dimmed">Your cart is empty</Text>
          </Center>
        ) : (
          <Stack gap="md" h="100%">
            {cart.map((item, idx) => (
              <Card key={idx} padding="md" withBorder>
                <Group justify="between" mb="xs">
                  <Text fw={600}>{item.title}</Text>
                  <Badge color="blue">{item.quantity}x</Badge>
                </Group>
                <Text size="sm" c="dimmed" mb="xs">${item.price} each</Text>
                <Group justify="between">
                  <Text size="sm" fw={600}>${item.price * item.quantity}</Text>
                  <Button size="xs" color="red" variant="light" onClick={() => removeFromCart(item.title)}>Remove</Button>
                </Group>
              </Card>
            ))}
            <Divider />
            <Box style={{ marginTop: 'auto' }}>
              <Group justify="between" mb="lg">
                <Text fw={700} size="lg">Total:</Text>
                <Text fw={700} size="lg">${cartTotal.toFixed(2)}</Text>
              </Group>
              <Button fullWidth color="violet.6" onClick={handleCheckoutRedirect}>Proceed to Checkout</Button>
            </Box>
          </Stack>
        )}
      </Drawer>
    </AppShell>
  );
}
