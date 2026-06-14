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

const FALLBACK_PRODUCTS = [
  { id: 1, title: 'Pro Wireless Headphones', price: 99, description: 'Active noise-cancelling over-ear layout runtime.' },
  { id: 2, title: 'Mechanical Gaming Keyboard', price: 129, description: 'RGB backlit mechanical frame brown switches.' },
  { id: 3, title: 'Ergonomic Wireless Mouse', price: 59, description: 'Precision tracking multi-surface optical layout.' },
  { id: 4, title: 'Ultra-Wide 4K Monitor', price: 449, description: '34-inch curved productivity screen IPS panel.' }
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const [messages, setMessages] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const MASTER_ADMIN_PASS = 'willy_secure_admin_pass_2026';

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === MASTER_ADMIN_PASS) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid administrative passphrase credentials.');
    }
  };

  const fetchLeadsData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('contact_messages').select('*');
      if (!error && data) {
        setMessages(data);
      }
    } catch (err) {
      console.error("Failed to fetch contact lead logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchLeadsData();
    }
  }, [isAuthenticated]);

  const handleDeleteMessage = async (id: any) => {
    if (!confirm('Permanently delete this customer lead message?')) return;
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) {
      alert('Failed to delete: ' + error.message);
    } else {
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    }
  };

  if (!isAuthenticated) {
    return (
      <Center style={{ width: '100vw', height: '100vh', backgroundColor: isDark ? 'var(--mantine-color-dark-8)' : 'var(--mantine-color-gray-0)' }}>
        <Card padding="xl" radius="lg" withBorder shadow="md" style={{ width: '100%', maxWidth: '400px' }}>
          <Box style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Title order={2} size="24px" fw={800}>🔒 Admin Gate Lock</Title>
            <Text size="xs" c="dimmed" mt={4}>Enter credentials to access secure database streams.</Text>
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
              <Button variant="outline" size="sm" onClick={fetchLeadsData} loading={loading}>Refresh Leads</Button>
              <ActionIcon onClick={() => toggleColorScheme()} variant="default" size="lg" radius="md">{isDark ? '☀️' : '🌙'}</ActionIcon>
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main pt={80}>
        <Container size="lg">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" style={{ alignItems: 'start' }}>
            
            {/* COLUMN 1: Inventory Catalog List */}
            <Card padding="xl" radius="lg" withBorder shadow="sm">
              <Title order={2} size="20px" mb="md" fw={800}>📂 Live Inventory Catalog ({products.length})</Title>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '500px', overflowY: 'auto' }}>
                {products.map((p, index) => (
                  <Card key={p.id || index} withBorder padding="sm" radius="md" style={{ backgroundColor: isDark ? 'var(--mantine-color-dark-6)' : 'var(--mantine-color-gray-0)' }}>
                    <Group justify="between">
                      <div style={{ maxWidth: '75%' }}>
                        <Text fw={600} size="sm" lineClamp={1}>{p.title}</Text>
                        <Text size="xs" c="dimmed" lineClamp={1}>{p.description}</Text>
                      </div>
                      <Badge color="green" size="md" variant="light">${p.price}</Badge>
                    </Group>
                  </Card>
                ))}
              </div>
            </Card>

            {/* COLUMN 2: Connected Get In Touch Leads Log */}
            <Card padding="xl" radius="lg" withBorder shadow="sm">
              <Title order={2} size="20px" mb="md" fw={800}>✉️ Get In Touch: Customer Leads ({messages.length})</Title>
              {loading ? (
                <Center py="xl"><Loader size="sm" /><Text size="sm" c="dimmed" ml="xs">Syncing email logs...</Text></Center>
              ) : messages.length === 0 ? (
                <Text c="dimmed" size="sm">No custom message submission forms captured inside database rows yet.</Text>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '500px', overflowY: 'auto' }}>
                  {messages.map((m, idx) => (
                    <Card key={m.id || idx} withBorder padding="md" radius="md" shadow="xs">
                      <Group justify="between" align="start" mb="xs">
                        <div>
                          {/* Loose fallback mappings handling lowercase and capitalized properties seamlessly */}
                          <Text fw={700} size="sm">{m.name || m.Name || 'Anonymous User'}</Text>
                          <Text size="xs" c="blue">{m.email || m.Email || 'No Email'}</Text>
                        </div>
                        <Button size="xs" color="red" variant="light" radius="md" onClick={() => handleDeleteMessage(m.id || m.ID || idx)}>
                          Clear Log
                        </Button>
                      </Group>
                      <Text size="xs" c={isDark ? 'gray.4' : 'gray.8'} style={{ backgroundColor: isDark ? 'var(--mantine-color-dark-5)' : '#f8f9fa', padding: '10px', borderRadius: '6px', whiteSpace: 'pre-wrap' }}>
                        {m.message || m.Message || 'Empty message content.'}
                      </Text>
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

