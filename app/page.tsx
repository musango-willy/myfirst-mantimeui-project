"use client";
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { 
  Container, Title, Text, Button, Group, Stack, SimpleGrid, Card, 
  ThemeIcon, AppShell, Burger, TextInput, Textarea, Box, ActionIcon, List, useMantineColorScheme
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { createClient } from '@supabase/supabase-js';

// Secure database connection client
const supabase = createClient(
  'https://supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwaWtjdWRobGtieW5teWN0cmRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNjQ4OTEsImV4cCI6MjA5Njg0MDg5MX0.7e4JH1IJ2sxpRR2mDpVwAJ5lLQkx7h0IHZfMxYKnmU8'
);

export default function HomePage() {
  const [opened, { toggle }] = useDisclosure();
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

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    setSuccess(false);

    const { error } = await supabase
      .from('contact_messages')
      .insert([{ name: values.name, email: values.email, message: values.message }]);

    setLoading(false);

    if (error) {
      alert('Failed to send message: ' + error.message);
    } else {
      setSuccess(true);
      form.reset();
    }
  };

  return (
    <AppShell header={{ height: 60 }} navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }} padding="md">
      {/* Global Header Bar */}
      <AppShell.Header>
        <Container size="lg" h="100%">
          <Group justify="between" h="100%">
            <Text fw={900} size="xl" variant="gradient" gradient={{ from: 'violetBrand.6', to: 'indigo.6' }}>MANTINE.io</Text>
            
            <Group gap="xl" visibleFrom="sm">
              <Text component="a" href="#" fw={500} size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Features</Text>
              <Text component="a" href="#pricing" fw={500} size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Pricing</Text>
              <Text component="a" href="#contact" fw={500} size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Contact</Text>
              <Button size="xs" variant="light" color="blue" component="a" href="/admin">Admin Log</Button>
            </Group>

            <Group visibleFrom="sm">
              <ActionIcon onClick={() => toggleColorScheme()} variant="default" size="lg" radius="md">
                {isDark ? '☀️' : '🌙'}
              </ActionIcon>
              <Button variant="default">Log In</Button>
              <Button gradient={{ from: 'violetBrand.6', to: 'indigo.6' }} variant="gradient">Get Started</Button>
            </Group>

            <Group hiddenFrom="sm">
              <ActionIcon onClick={() => toggleColorScheme()} variant="default" size="lg" radius="md" mr="xs">
                {isDark ? '☀️' : '🌙'}
              </ActionIcon>
              <Burger opened={opened} onClick={toggle} size="sm" />
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack gap="md" style={{ width: '100%' }}>
          <Button variant="subtle" fullWidth color="gray">Features</Button>
          <Button variant="subtle" fullWidth color="gray" component="a" href="#pricing" onClick={toggle}>Pricing</Button>
          <Button variant="subtle" fullWidth color="gray" component="a" href="#contact" onClick={toggle}>Contact</Button>
          <Button variant="light" fullWidth color="blue" component="a" href="/admin">Admin Panel</Button>
          <Button variant="default" fullWidth mt="md">Log In</Button>
          <Button gradient={{ from: 'violetBrand.6', to: 'indigo.6' }} variant="gradient" fullWidth>Get Started</Button>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main pt={60}>
        <Container size="lg" py={60}>
          {/* Hero Section */}
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50} style={{ alignItems: 'center' }}>
            <div>
              <Title
                order={1}
                size="calc(2rem + 1.5vw)"
                fw={900}
                lh={1.2}
                style={{
                  backgroundImage: 'linear-gradient(90deg, var(--mantine-color-violetBrand-6), var(--mantine-color-indigo-6))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Automate your workflow in a single click.
              </Title>
              <Text c="dimmed" size="lg" mt="xl">
                Stop wasting hours on manual data entry. Our platform connects your favorite software pipeline seamlessly so you can focus on building your actual product.
              </Text>
              <Group mt={40}>
                <Button size="lg" gradient={{ from: 'violetBrand.6', to: 'indigo.6' }} variant="gradient">Start free trial</Button>
                <Button size="lg" variant="outline" color="violetBrand.6">Book a live demo</Button>
              </Group>
            </div>
            <div style={{ height: '380px', backgroundColor: isDark ? 'var(--mantine-color-dark-6)' : 'var(--mantine-color-gray-1)', borderRadius: '24px', border: '1px dashed var(--mantine-color-gray-4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text c="gray.5" fw={500}>[ Product Dashboard Mockup Preview ]</Text>
            </div>
          </SimpleGrid>

          {/* Features Grid */}
          <div style={{ marginTop: '120px' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <Title order={2} size="32px" fw={800}>Everything you need to scale</Title>
              <Text c="dimmed" mt="sm" maw={600} mx="auto">Our platform includes all the enterprise-ready infrastructure integrations out of the box.</Text>
            </div>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
              <Card shadow="sm" padding="xl" withBorder>
                <ThemeIcon variant="light" size="xl" radius="md" color="violetBrand.6">⚡</ThemeIcon>
                <Text fw={700} size="lg" mt="md">Real-time Analytics</Text>
                <Text size="sm" c="dimmed" mt="sm" lh={1.5}>Track performance metrics immediately as they happen. Never make decisions blindly again.</Text>
              </Card>
              <Card shadow="sm" padding="xl" withBorder>
                <ThemeIcon variant="light" size="xl" radius="md" color="violetBrand.4">🔒</ThemeIcon>
                <Text fw={700} size="lg" mt="md">Secure Encryption</Text>
                <Text size="sm" c="dimmed" mt="sm" lh={1.5}>Your data is fully encrypted both in transit and at rest with bank-grade security protocols.</Text>
              </Card>
              <Card shadow="sm" padding="xl" withBorder>
                <ThemeIcon variant="light" size="xl" radius="md" color="indigo.6">⚙️</ThemeIcon>
                <Text fw={700} size="lg" mt="md">Easy Integrations</Text>
                <Text size="sm" c="dimmed" mt="sm" lh={1.5}>Connect seamlessly to Slack, Discord, GitHub, and over 2,000 other apps using our visual builder.</Text>
              </Card>
            </SimpleGrid>
          </div>

          {/* Polished Pricing Section Grid */}
          <div id="pricing" style={{ marginTop: '120px' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <Title order={2} size="32px" fw={800}>Simple, predictable pricing</Title>
              <Text c="dimmed" mt="sm">All plans come with a 14-day trial. No credit card required.</Text>
            </div>

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" maw={800} mx="auto">
              {/* Starter Plan */}
              <Card shadow="sm" padding="xl" withBorder>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">Starter</Text>
                <Group align="flex-end" gap="xs" mt="xs">
                  <Title order={3} size="42px" lh={1}>$19</Title>
                  <Text c="dimmed" size="sm" pb="xs">/ month</Text>
                </Group>
                <Text size="sm" c="dimmed" mt="md">Perfect for freelancers and side projects getting off the ground.</Text>
                <div style={{ marginTop: '24px', marginBottom: '24px' }}>
                  <Text size="sm" mt="xs">✓ Up to 5 active workflows</Text>
                  <Text size="sm" mt="xs">✓ Standard 15-minute sync intervals</Text>
                  <Text size="sm" mt="xs">✓ Email support assistance</Text>
                </div>
                <Button variant="outline" color="violetBrand.6" fullWidth>Choose Starter</Button>
              </Card>

              {/* Pro Plan */}
              <Card shadow="md" padding="xl" withBorder style={{ borderColor: 'var(--mantine-color-violetBrand-6)' }}>
                <Text size="xs" tt="uppercase" fw={700} c="violetBrand.6">Pro</Text>
                <Group align="flex-end" gap="xs" mt="xs">
                  <Title order={3} size="42px" lh={1}>$49</Title>
                  <Text c="dimmed" size="sm" pb="xs">/ month</Text>
                </Group>
                <Text size="sm" c="dimmed" mt="md">Best configuration for growing businesses and startup environments.</Text>
                <div style={{ marginTop: '24px', marginBottom: '24px' }}>
                  <Text size="sm" mt="xs" fw={500}>✓ Unlimited active workflows</Text>
                  <Text size="sm" mt="xs" fw={500}>✓ Instant real-time synchronization</Text>
                  <Text size="sm" mt="xs" fw={500}>✓ Priority 24/7 Slack support</Text>
                </div>
                <Button gradient={{ from: 'violetBrand.6', to: 'indigo.6' }} variant="gradient" fullWidth>Choose Pro</Button>
              </Card>
            </SimpleGrid>
          </div>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
