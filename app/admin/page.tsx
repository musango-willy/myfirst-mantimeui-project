"use client";

import { useEffect, useState } from 'react';
import { 
  Container, Title, Text, Button, Group, Card, SimpleGrid,
  Loader, Center, AppShell, ActionIcon, useMantineColorScheme, TextInput, Box, Badge
} from '@mantine/core';
import { createClient } from '@supabase/supabase-js';

const FALLBACK_PRODUCTS = [
  { id: 1, title: 'Pro Wireless Headphones', price: 99, description: 'Active noise-cancelling over-ear runtime.' },
  { id: 2, title: 'Mechanical Gaming Keyboard', price: 129, description: 'RGB backlit mechanical frame brown switches.' },
  { id: 3, title: 'Ergonomic Wireless Mouse', price: 59, description: 'Precision tracking multi-surface optical layout.' }
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [products, setProducts] = useState<any[]>(FALLBACK_PRODUCTS);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const MASTER_ADMIN_PASS = 'willy_secure_admin_pass_2026';

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === MASTER_ADMIN_PASS) {
      setIsAuthenticated(true);
    } else {
      setLoginError('Invalid administrative credentials.');
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
            <TextInput type="password" label="Enter Master Passphrase" placeholder="••••••••••••" required value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} error={loginError} />
            <Button type="submit" fullWidth mt="xl" color="violet.6">Unlock Terminal Panel</Button>
          </form>
        </Card>
      </Center>
    );
  }

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header><Container size="lg" h="100%"><Group justify="between" h="100%"><Text fw={900} size="xl">MANTINE Admin</Text></Group></Container></AppShell.Header>
      <AppShell.Main pt={80}>
        <Container size="lg">
          <Card padding="xl" radius="lg" withBorder shadow="sm">
            <Title order={2} size="20px" mb="md" fw={800}>📂 Live Inventory Catalog ({products.length})</Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {products.map((p) => (
                <Card key={p.id} withBorder padding="sm" radius="md">
                  <Group justify="between">
                    <div><Text fw={600} size="sm">{p.title}</Text></div>
                    <Badge color="green">${p.price}</Badge>
                  </Group>
                </Card>
              ))}
            </div>
          </Card>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
