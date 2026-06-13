"use client";

import { useEffect, useState } from 'react';
import { 
  Container, Title, Text, Button, Group, Stack, SimpleGrid, Card, 
  AppShell, Burger, Box, ActionIcon, useMantineColorScheme, Drawer, Divider, Badge, Center
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  'https://supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwaWtjdWRobGtieW5teWN0cmRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNjQ4OTEsImV4cCI6MjA5Njg0MDg5MX0.7e4JH1IJ2sxpRR2mDpVwAJ5lLQkx7h0IHZfMxYKnmU8'
);

interface ProductRow { 
  title?: string; 
  price?: number; 
  description?: string; 
  image_url?: string; 
}
interface CartItem extends ProductRow { quantity: number; }

export default function HomePage() {
  const [opened, { toggle }] = useDisclosure();
  const [cartOpened, { open: openCart, close: closeCart }] = useDisclosure(false);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    async function loadProducts() {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (error) {
          console.error("Database read failure:", error.message);
          return;
        }
        if (data && data.length > 0) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Fetch intercepted:", err);
      }
    }
    loadProducts();
  }, []);

  const addToCart = (product: ProductRow) => {
    const itemTitle = product.title || 'Untitled Item';
    setCart((prev) => {
      const existing = prev.find((item) => (item.title || 'Untitled Item') === itemTitle);
      if (existing) {
        return prev.map((item) => (item.title || 'Untitled Item') === itemTitle ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    openCart();
  };

  const removeFromCart = (title: string) => {
    setCart((prev) => prev.filter((item) => (item.title || 'Untitled Item') !== title));
  };

  const cartTotal = cart.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);
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
            </Group>

            <Group visibleFrom="sm">
              <ActionIcon onClick={() => toggleColorScheme()} variant="default" size="lg" radius="md">
                {isDark ? '☀️' : '🌙'}
              </ActionIcon>
              <Button onClick={openCart} variant="light" color="violet.6">
                🛒 Cart ({totalItems})
              </Button>
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
          <Box id="catalog" style={{ marginTop: '20px' }}>
            <Box style={{ textAlign: 'center', marginBottom: '50px' }}>
              <Title order={1} size="36px" fw={900}>
                Assorted Multi-Category Marketplace
              </Title>
              <Text c="dimmed" mt="xs">Streamed live from our secure PostgreSQL database rows.</Text>
            </Box>

            {!products || products.length === 0 ? (
              <Card padding="xl" radius="lg" withBorder style={{ textAlign: 'center' }}>
                <Text c="dimmed">No products are currently active in our live catalog inventory store sheet.</Text>
              </Card>
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
                {products.map((product, idx) => {
                  const displayTitle = product.title || 'Premium Marketplace Item';
                  const displayPrice = product.price || 45;
                  const displayDesc = product.description || 'High-quality item available in our catalog inventory collection.';
                  const displayImg = product.image_url || 'https://unsplash.com';

                  return (
                    <Card key={`prod-${idx}`} shadow="sm" padding="xl" radius="lg" withBorder style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Box style={{ width: '100%', height: '180px', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
                        <img src={displayImg} alt={displayTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </Box>
                      <Group justify="between" mb="xs">
                        <Text fw={700} size="sm" lineClamp={1}>{displayTitle}</Text>
                        <Badge color="green" size="lg" variant="light">${displayPrice}</Badge>
                      </Group>
                      <Text size="xs" c="dimmed" style={{ flexGrow: 1 }} lineClamp={2}>{displayDesc}</Text>
                      <Button fullWidth mt="xl" color="violet.6" radius="md" onClick={() => addToCart(product)}>
                        Add to Cart
                      </Button>
                    </Card>
                  );
                })}
              </SimpleGrid>
            )}
          </Box>
        </Container>
      </AppShell.Main>

      <Drawer opened={cartOpened} onClose={closeCart} title="🛒 Your Shopping Cart" position="right" size="md" padding="xl">
        <Divider mb="xl" />
        {cart.length === 0 ? (
          <Center style={{ height: '200px' }}><Text c="dimmed">Your shopping cart layout is currently empty.</Text></Center>
        ) : (
          <Box style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 150px)', justifyContent: 'space-between' }}>
            <Box style={{ overflowY: 'auto', flexGrow: 1, paddingRight: '4px' }}>
              {cart.map((item, index) => {
                const itemTitle = item.title || 'Untitled Item';
                const itemPrice = item.price || 0;
                return (
                  <Card key={`cart-${index}`} withBorder mb="md" padding="sm" radius="md">
                    <Group justify="between">
                      <div style={{ maxWidth: '60%' }}>
                        <Text fw={600} size="sm" lineClamp={1}>{itemTitle}</Text>
                        <Text size="xs" c="dimmed">Qty: {item.quantity} × ${itemPrice}</Text>
                      </div>
                      <Group>
                        <Text fw={700} size="sm" c="violet.6">${itemPrice * item.quantity}</Text>
                        <Button size="xs" variant="subtle" color="red" onClick={() => removeFromCart(itemTitle)}>✕</Button>
                      </Group>
                    </Group>
                  </Card>
                );
              })}
            </Box>
            <Box>
              <Divider my="md" />
              <Group justify="between" mb="xl">
                <Text fw={800} size="lg">Estimated Subtotal:</Text>
                <Text fw={900} size="xl" c="green.6">${cartTotal}</Text>
              </Group>
              <Button fullWidth size="md" gradient={{ from: 'violet.6', to: 'indigo.6' }} variant="gradient" onClick={() => alert('Proceeding to checkout gateway setup...')}>
                Proceed to Secure Checkout
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>
    </AppShell>
  );
}
