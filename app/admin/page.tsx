"use client";

import { useEffect, useState } from 'react';
import { 
  Container, Title, Text, Table, Button, Group, Card, 
  Loader, Center, AppShell, ActionIcon, useMantineColorScheme 
} from '@mantine/core';
import { createClient } from '@supabase/supabase-js';

// Secure database connection client matching your project cluster
const supabase = createClient(
  'https://supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwaWtjdWRobGtieW5teWN0cmRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNjQ4OTEsImV4cCI6MjA5Njg0MDg5MX0.7e4JH1IJ2sxpRR2mDpVwAJ5lLQkx7h0IHZfMxYKnmU8'
);

interface MessageRow {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export default function AdminPage() {
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null); // Track which row is deleting
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      alert('Error loading database data: ' + error.message);
    } else if (data) {
      setMessages(data);
    }
    setLoading(false);
  };

  // 1. Function to delete a message row from Supabase live
  const handleDelete = async (id: number) => {
    if (!confirm('Are you absolutely sure you want to delete this message record permanently?')) {
      return;
    }

    setDeletingId(id);
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id); // Match rows by their primary database ID key

    if (error) {
      alert('Failed to delete message: ' + error.message);
      setDeletingId(null);
    } else {
      // Instantly filter out the deleted message from your screen layout state
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Container size="lg" h="100%">
          <Group justify="between" h="100%">
            <Group>
              <Text fw={900} size="xl" variant="gradient" gradient={{ from: 'violetBrand.6', to: 'indigo.6' }}>
                MANTINE Admin
              </Text>
              <Text size="xs" fw={700} c="blue" bg="blue.0" px="xs" py={2} style={{ borderRadius: 6 }}>PRIVATE ACCESS</Text>
            </Group>
            
            <Group>
              <Button variant="subtle" size="sm" component="a" href="/">Back to Site</Button>
              <ActionIcon onClick={() => toggleColorScheme()} variant="default" size="lg" radius="md">
                {isDark ? '☀️' : '🌙'}
              </ActionIcon>
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main pt={80}>
        <Container size="lg">
          <Group justify="between" mb="xl">
            <div>
              <Title order={1} size="28px" fw={800}>Customer Leads Log</Title>
              <Text size="sm" c="dimmed" mt={4}>Review and manage incoming contact validation text forms submitted by web visitors.</Text>
            </div>
            <Button onClick={fetchMessages} variant="outline" color="violetBrand.6" disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh Data Grid'}
            </Button>
          </Group>

          {loading ? (
            <Center style={{ height: '200px' }}>
              <Group gap="xs"><Loader size="sm" /> <Text c="dimmed" size="sm">Reading database records...</Text></Group>
            </Center>
          ) : messages.length === 0 ? (
            <Card padding="xl" radius="lg" withBorder style={{ textAlign: 'center' }}>
              <Text c="dimmed">No entries found inside the `contact_messages` table yet.</Text>
            </Card>
          ) : (
            <Card padding={0} radius="lg" withBorder shadow="xs" style={{ overflow: 'hidden' }}>
              <Table highlightOnHover verticalSpacing="md" horizontalSpacing="lg">
                <Table.Thead style={{ backgroundColor: isDark ? 'var(--mantine-color-dark-6)' : 'var(--mantine-color-gray-0)' }}>
                  <Table.Tr>
                    <Table.Th style={{ width: '60px' }}>ID</Table.Th>
                    <Table.Th style={{ width: '180px' }}>Sender Profile</Table.Th>
                    <Table.Th style={{ width: '220px' }}>Email Address</Table.Th>
                    <Table.Th>Inquiry Content Message</Table.Th>
                    <Table.Th style={{ width: '160px' }}>Received At</Table.Th>
                    <Table.Th style={{ width: '110px' }}>Actions</Table.Th> {/* Header column for delete button */}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {messages.map((msg) => (
                    <Table.Tr key={msg.id}>
                      <Table.Td fw={700} c="dimmed">#{msg.id}</Table.Td>
                      <Table.Td fw={600}>{msg.name}</Table.Td>
                      <Table.Td c="blue" style={{ wordBreak: 'break-all' }}>{msg.email}</Table.Td>
                      <Table.Td style={{ whiteSpace: 'pre-wrap' }}>{msg.message}</Table.Td>
                      <Table.Td c="dimmed">
                        {new Date(msg.created_at).toLocaleDateString(undefined, {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </Table.Td>
                      <Table.Td>
                        {/* 2. Interactive Delete Action Button */}
                        <Button 
                          color="red" 
                          variant="light" 
                          size="xs" 
                          radius="md"
                          loading={deletingId === msg.id}
                          onClick={() => handleDelete(msg.id)}
                        >
                          Delete
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Card>
          )}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}