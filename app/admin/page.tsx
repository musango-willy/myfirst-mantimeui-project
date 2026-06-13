"use client";

import { useEffect, useState } from 'react';
import { 
  Container, Title, Text, Button, Group, Card, SimpleGrid,
  Loader, Center, AppShell, ActionIcon, useMantineColorScheme, TextInput, Box, Badge
} from '@mantine/core';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  'https://supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwaWtjdWRobGtieW5teWN0cmRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNjQ4OTEsImV4cCI6MjA5Njg0MDg5MX0.7e4JH1IJ2sxpRR2mDpVwAJ5lLQkx7h0IHZfMxYKnmU8'
);

interface MessageRow { id: number; name: string; email: string; message: string; created_at: string; }
interface ProductRow { id: number; title: string; price: number; description: string; image_url: string; }

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const MASTER_ADMIN_PASS = 'willy_secure_admin_pass_2026';

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === MASTER_ADMIN_PASS) {
      setIsAuthenticated(true);
      setLoginError('');
      fetchData();
    } else {
      setLoginError('Invalid access credentials.');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const msgsRes = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
      const prodsRes = await supabase.from('products').select('*').order('id', { ascending: true });
      
      if (msgsRes.data) setMessages(msgsRes.data);
      if (prodsRes.data) setProducts(prodsRes.data);
    } catch (err) {
      console.error("Dashboard failed to stream data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Permanently delete this product from the master database?')) return;
    
    // Inject the administrative security token key inside headers to pass postgres checks
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Security block: ' + error.message);
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  if (!isAuthenticated) {
    return (
      <Center style={{ width: '100vw', height: '100vh', backgroundColor: isDark ? 'var(--mantine-color-dark-8)' : 'var(--mantine-color-gray-0)' }}>
        <Card padding="xl" radius="lg" withBorder shadow="md" style={{ width: '100%', maxWidth: '400px' }}>
          <Box style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Title order={2} size="24px" fw={800}>🔒 Admin Gate Lock</Title>
            <Text size="xs" c="dimmed" mt={4}>Enter credentials to access private database streams.</Text>
          </Box>
          <form onSubmit={handlePasswordSubmit}>
            <TextInput 
              type="password"
              label="Enter Master Passphrase" 
              placeholder="••••••••••••" 
              required 
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              error={loginError}
            />
            <Button type="submit" fullWidth mt="xl" color="violet.6">Unlock Terminal Panel</Button>
            <Button variant="subtle" size="xs" fullWidth mt="sm" component="a" href="/">Return to Homepage</Button>
          </form>
        </Card>
      </Center>
    );
  }

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Container size="lg" h="100%">
          <Group justify="between" h="100%">
            <Group>
              <Text fw={900} size="xl" variant="gradient" gradient={{ from: 'violet.6', to: 'indigo.6' }}>MANTINE Admin</Text>
              <Badge color="green" variant="light">AUTHENTICATED</Badge>
            </Group>
            <Group>
              <Button variant="subtle" size="sm" component="a" href="/">Back to Site</Button>
              <ActionIcon onClick={() => toggleColorScheme()} variant="default" size="lg" radius="md">{isDark ? '☀️' : '🌙'}</ActionIcon>
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main pt={80}>
        <Container size="lg">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" style={{ alignItems: 'start' }}>
            
            {/* Inventory Catalog List */}
            <Card padding="xl" radius="lg" withBorder shadow="sm">
              <Title order={2} size="20px" mb="md" fw={800}>📂 Live Inventory Catalog ({products.length})</Title>
              {loading ? <Center py="xl"><Loader size="sm" /></Center> : products.length === 0 ? (
                <Text c="dimmed" size="sm">No inventory records generated yet.</Text>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '500px', overflowY: 'auto' }}>
                  {products.map((p) => (
                    <Card key={p.id} withBorder padding="sm" radius="md">
                      <Group justify="between">
                        <div style={{ maxWidth: '65%' }}>
                          <Text fw={600} size="sm" lineClamp={1}>{p.title}</Text>
                          <Text size="xs" c="dimmed" lineClamp={1}>{p.description}</Text>
                        </div>
                        <Group>
                          <Text fw={700} c="green.6" size="sm">${p.price}</Text>
                          <Button size="xs" color="red" variant="light" radius="md" onClick={() => handleDeleteProduct(p.id)}>Delete</Button>
                        </Group>
                      </Group>
                    </Card>
                  ))}
                </div>
              )}
            </Card>

            {/* Customer Leads Log */}
            <Card padding="xl" radius="lg" withBorder shadow="sm">
              <Title order={2} size="20px" mb="md" fw={800}>✉️ Customer Leads Log ({messages.length})</Title>
              {loading ? <Center py="xl"><Loader size="sm" /></Center> : messages.length === 0 ? (
                <Text c="dimmed">No contact submissions found.</Text>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {messages.map((m) => (
                    <Card key={m.id} withBorder padding="sm" radius="md">
                      <Text fw={600} size="sm">{m.name}</Text>
                      <Text size="xs" c="blue" mb="xs">{m.email}</Text>
                      <Text size="xs" c="gray.7" style={{ backgroundColor: '#f8f9fa', padding: '6px', borderRadius: '4px' }}>{m.message}</Text>
                    </Card>
                  ))}
                </div>
              )}
            </Card>

          </SimpleGrid>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
