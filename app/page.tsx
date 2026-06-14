"use client";

import { useEffect, useState } from 'react';
import { 
  Container, Text, Button, Group, SimpleGrid, Card, 
  AppShell, Burger, Box, Center, ActionIcon, useMantineColorScheme, Drawer, Divider, Badge, Stack
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  'https://supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwaWtjdWRobGtieW5teWN0cmRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNjQ4OTEsImV4cCI6MjA5Njg0MDg5MX0.7e4JH1IJ2sxpRR2mDpVwAJ5lLQkx7h0IHZfMxYKnmU8'
);

// 1. HARDCODED EMERGENCY DATA BACKUP CATALOG
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
  const [products, setProducts] = useState<ProductRow[]>(FALLBACK_PRODUCTS); // Default directly to fallback layout
  const [mounted, setMounted] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    setMounted(true);
    async function loadProducts() {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (!error && data && data.length > 0) {
          setProducts(data); // If network is active, load live data rows
        }
      } catch (err) {
        console.log("Supabase DNS Outage detected. Using local repository dataset safely.");
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

      <AppShell.Navbar p="md">
        <Stack style={{ width: '100%', gap: 16 }}>
          <Button variant="subtle" fullWidth onClick={openCart}>🛒 Open Cart ({totalItems})</Button>
          <Button variant="default" fullWidth component="a" href="/admin">Admin Panel</Button>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main pt={60}>
        <Container size="lg" py={60}>
          <Box id="catalog">
            <Box style={{ textAlign: 'center', marginBottom: '50px' }}>
              <Text component="h1" size="36px" fw={900} variant="gradient" gradient={{ from: 'violet.6', to: 'indigo.6' }}>
                Assorted Multi-Category Marketplace
              </Text>
              <Text c="dimmed" mt="xs">Bypassing external network latency anomalies securely.</Text>
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
        </Container>
      </AppShell.Main>

      <Drawer opened={cartOpened} onClose={closeCart} title="🛒 Your Shopping Cart" position="right" size="md" padding="xl">
        <Divider mb="xl" />
        {cart.length === 0 ? (
          <Center style={{ height: '200px' }}><Text c="dimmed">Your shopping cart layout is currently empty.</Text></Center>
        ) : (
          <Box style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 150px)', justifyContent: 'space-between' }}>
            <Box style={{ overflowY: 'auto', flexGrow: 1 }}>
              {cart.map((item, index) => (
                <Card key={index} withBorder mb="md" padding="sm" radius="md">
                  <Group justify="between">
                    <div>
                      <Text fw={600} size="sm">{item.title}</Text>
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
              <Group justify="between" mb="xl">
                <Text fw={800} size="lg">Estimated Subtotal:</Text>
                <Text fw={900} size="xl" c="green.6">${cartTotal}</Text>
              </Group>
              <Button fullWidth size="md" variant="gradient" gradient={{ from: 'violet.6', to: 'indigo.6' }}>Proceed to Checkout</Button>
            </Box>
          </Box>
        )}
      </Drawer>
    </AppShell>
  );
}
