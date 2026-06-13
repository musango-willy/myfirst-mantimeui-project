"use client";

import { useEffect, useState } from 'react';
import { 
  Container, Title, Text, Button, Group, Card, SimpleGrid,
  Loader, Center, AppShell, ActionIcon, useMantineColorScheme, TextInput, Box
} from '@mantine/core';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  'https://supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwaWtjdWRobGtieW5teWN0cmRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNjQ4OTEsImV4cCI6MjA5Njg0MDg5MX0.7e4JH1IJ2sxpRR2mDpVwAJ5lLQkx7h0IHZfMxYKnmU8'
);

interface MessageRow { id: number; name: string; email: string; message: string; created_at: string; }
interface ProductRow { id: number; title: string; price: number; description: string; }

export default function AdminPage() {
  // 1. Core Security Gate Hooks
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  // Master Administrative Access Passphrase
  const MASTER_ADMIN_PASS = 'willy_secure_admin_pass_2026';

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === MASTER_ADMIN_PASS) {
      setIsAuthenticated(true);
      setLoginError('');
      fetchData();
    } else {
      setLoginError('Invalid access key code credentials. Access Denied.');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const msgsRes = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    const prodsRes = await supabase.from('products').select('*');
    
    if (msgsRes.data) setMessages(msgsRes.data);
    if (prodsRes.data) setProducts(prodsRes.data);
    setLoading(false);
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm('Delete this product?')) {
      await supabase.from('products').delete().eq('id', id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleDeleteMessage = async (id: number) => {
    if (confirm('Permanently delete this message log?')) {
      await supabase.from('contact_messages').delete().eq('id', id);
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    }
  };

  // 2. RENDER THE INTERCEPTING PASSWORD CARD LOCK IF NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <Center style={{ width: '100vw', height: '100vh', backgroundColor: isDark ? 'var(--mantine-color-dark-8)' : 'var(--mantine-color-gray-0)' }}>
        <Card padding="xl" radius="lg" withBorder shadow="md" style={{ width: '100%', maxWidth: '400px' }}>
          <Box style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Title order={2} size="24px" fw={800}>🔒 Admin Gate Lock</Title>
            <Text size="xs" c="dimmed" mt={4}>This pathway contains secure private operational database structures.</Text>
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
            <Button type="submit" fullWidth mt="xl" color="violet.6">
              Unlock Terminal Panel
            </Button>
            <Button variant="subtle" size="xs" fullWidth mt="sm" component="a" href="/">
              Return back to Homepage
            </Button>
          </form>
        </Card>
      </Center>
    );
  }

  // 3. MAIN DASHBOARD CONTENT INTERFACE (Only mounts when unlocked)
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Container size="lg" h="100%">
          <Group justify="between" h="100%">
            <Group>
              <Text fw={900} size="xl" variant="gradient" gradient={{ from: 'violet.6', to: 'indigo.6' }}>MANTINE Admin</Text>
              <Text size="xs" fw={700} c="green" bg="green.0" px="xs" py={2}>AUTHENTICATED TERMINAL</Text>
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
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" mb="50px" style={{ alignItems: 'start' }}>
            <Card padding="xl" radius="lg" withBorder shadow="sm">
              <Title order={2} size="20px" mb="md" fw={800}>📂 Live Inventory Catalog</Title>
              {products.length === 0 ? <Text c="dimmed" size="sm">No inventory records generated yet.</Text> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {products.map((p) => (
                    <Card key={p.id} withBorder padding="sm" radius="md">
                      <Group justify="between">
                        <div style={{ maxWidth: '70%' }}>
                          <Text fw={600} size="sm">{p.title}</Text>
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

            <Card padding="xl" radius="lg" withBorder shadow="sm">
              <Title order={2} size="20px" mb="md" fw={800}>✉️ Customer Leads Log</Title>
              {loading ? <Loader size="sm" /> : messages.length === 0 ? <Text c="dimmed">No submissions found.</Text> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {messages.map((m) => (
                    <Card key={m.id} withBorder padding="sm" radius="md">
                      <Group justify="between">
                        <div>
                          <Text fw={600} size="sm">{m.name}</Text>
                          <Text size="xs" c="dimmed">{m.email}</Text>
                        </div>
                        <Button size="xs" color="red" variant="light" radius="md" onClick={() => handleDeleteMessage(m.id)}>Clear</Button>
                      </Group>
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
