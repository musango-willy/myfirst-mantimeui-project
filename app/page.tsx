"use client";

import { useEffect, useState } from 'react';
import { 
  Container, Title, Text, Button, Group, SimpleGrid, Card, 
  AppShell, Burger, Box, ActionIcon, useMantineColorScheme, Drawer, Divider, Badge, Stack, TextInput, Textarea
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  'https://supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwaWtjdWRobGtieW5teWN0cmRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNjQ4OTEsImV4cCI6MjA5Njg0MDg5MX0.7e4JH1IJ2sxpRR2mDpVwAJ5lLQkx7h0IHZfMxYKnmU8'
);

// 1. DYNAMIC CATALOG STORAGE MAPS (Electronics, Clothing, and Furniture Selections)
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
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  // Inquiry Validation Form Hooks
  const contactForm = useForm({
    validateInputOnChange: true,
    initialValues: { name: '', email: '', message: '' },
    validate: {
      name: (val) => (val.trim().length < 2 ? 'Name is required' : null),
      email: (val) => (/^\S+@\S+\.\S+$/.test(val) ? null : 'Invalid email pattern'),
      message: (val) => (val.trim().length === 0 ? 'Message content is required' : null),
    }
  });

  useEffect(() => {
    setMounted(true);
    async function loadProducts() {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (!error && data && data.length > 0) {
          setProducts(data);
        }
      } catch (err) {
        console.log("Using direct fallback cache mapping loops.");
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

  // 2. STRIPE REDIRECT ACTION LOOP (Computes checkout totals securely on server api layer)
  const handleCheckoutRedirect = async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems: cart }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url; // Bounce client browser directly to Stripe Hosted Checkout Canvas
      } else {
        alert('Stripe Gate Intercept Error: ' + (data.error || 'Check server logs.'));
      }
    } catch (err: any) {
      alert('Transmission crash: ' + err.message);
    }
  };

  // 3. CONTACT MAIL LOG ROUTINE (Routes leads to your gmail inbox and logs to database)
  const handleContactSubmit = async (values: typeof contactForm.values) => {
    setEmailLoading(true);
    setEmailSuccess(false);
    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        alert('Email routing failure: ' + (data.error || 'Network latency drop.'));
      } else {
        setEmailSuccess(true);
        contactForm.reset();
      }
    } catch (err: any) {
      alert('Network transmission failed: ' + err.message);
    } finally {
      setEmailLoading(false);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (!mounted) return null;

  return (
    <AppShell header={{ height: 60 }} navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }} padding="md">
      <AppShell.Header>
        <Container size="lg" h="100%">
          <Group justify="between" h="100%">
            <Text fw={900} size="xl" variant="gradient" gradient={{ from: 'violet.6', to: 'indigo.6' }}>MANTINE.io</Text>
            
            <Group gap="xl" visibleFrom="sm">
              <Text component="a" href="#" fw={500} size="sm" c="dimmed">Features</Text>
              <Text component="a" href="#catalog" fw={500} size="sm" c="dimmed">Store Catalog</Text>
              <Text component="a" href="#contact" fw={500} size="sm" c="dimmed">Contact Form</Text>
            </Group>

            <Group visibleFrom="sm">
              <ActionIcon onClick={() => toggleColorScheme()} variant="default" size="lg" radius="md">
                {isDark ? '☀️' : '🌙'}
              </ActionIcon>
              <Button onClick={openCart} variant="light" color="violet.6">
                🛒 Cart ({totalItems})
              </Button>
              <Button variant="default" component="a" href="/admin">Admin Panel</Button>
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
          
          {/* Marketplace Grid Component Layout */}
          <Box id="catalog" style={{ scrollMarginTop: '80px', marginBottom: '100px' }}>
            <Box style={{ textAlign: 'center', marginBottom: '50px' }}>
              <Title
                order={1}
                size="36px"
                fw={900}
                style={{
                  backgroundImage: 'linear-gradient(90deg, #7c3aed, #4f46e5)',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                Assorted Multi-Category Marketplace
              </Title>
              <Text c="dimmed" mt="xs">Streamed live from our secure PostgreSQL database rows.</Text>
            </Box>

            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
              {products.map((product, idx) => (
                <Card key={idx} shadow="sm" padding="xl" radius="lg" withBorder style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box style={{ width: '100%', height: '180px', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
                    <img src={product.image_url} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                  <Group justify="between" mb="xs">
                    <Text fw={700}>{product.title}</Text>
                    <Badge color="violet" variant="light">${product.price}</Badge>
                  </Group>
                  <Text size="sm" color="dimmed" mb="md">{product.description}</Text>
                  <Button fullWidth onClick={() => addToCart(product)}>Add to Cart</Button>
                </Card>
              ))}
            </SimpleGrid>
          </Box>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
