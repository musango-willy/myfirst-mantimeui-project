"use client";

import { useState } from 'react';
import { 
  Container, Title, Text, Button, Group, SimpleGrid, Card, 
  ThemeIcon, AppShell, Burger, TextInput, Textarea, Box 
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { createClient } from '@supabase/supabase-js';

// Self-contained secure backend database connection instance
const supabase = createClient(
  'https://supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwaWtjdWRobGtieW5teWN0cmRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNjQ4OTEsImV4cCI6MjA5Njg0MDg5MX0.7e4JH1IJ2sxpRR2mDpVwAJ5lLQkx7h0IHZfMxYKnmU8'
);

export default function HomePage() {
  const [opened, { toggle }] = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm({
    validateInputOnChange: true,
    initialValues: { name: '', email: '', message: '' },
    validate: {
      name: (value) => (value.trim().length < 2 ? 'Name must have at least 2 characters' : null),
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Invalid email address format'),
      message: (value) => (value.trim().length === 0 ? 'Message content cannot be empty' : null),
    },
  });

  // Handle saving the user message directly to the database backend
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
      <AppShell.Header>
        <Container size="lg" h="100%">
          <Group justify="between" h="100%">
            <Text fw={900} size="xl" variant="gradient" gradient={{ from: 'violetBrand.6', to: 'indigo.6' }}>MANTINE.io</Text>
            <Group gap="xl" visibleFrom="sm">
              <Text component="a" href="#" fw={500} size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Features</Text>
              <Text component="a" href="#" fw={500} size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Pricing</Text>
              <Text component="a" href="#" fw={500} size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Contact</Text>
            </Group>
            <Group visibleFrom="sm">
              <Button variant="default">Log In</Button>
              <Button gradient={{ from: 'violetBrand.6', to: 'indigo.6' }} variant="gradient">Get Started</Button>
            </Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <Button variant="subtle" fullWidth color="gray">Features</Button>
          <Button variant="subtle" fullWidth color="gray">Pricing</Button>
          <Button variant="subtle" fullWidth color="gray">Contact</Button>
          <Button variant="default" fullWidth mt="md">Log In</Button>
          <Button gradient={{ from: 'violetBrand.6', to: 'indigo.6' }} variant="gradient" fullWidth>Get Started</Button>
        </div>
      </AppShell.Navbar>

      <AppShell.Main pt={60}>
        <Container size="lg" py={60}>
          {/* Hero Section */}
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50} style={{ alignItems: 'center' }}>
            <div>
              <Text component="h1" size="calc(2rem + 1.5vw)" fw={900} lh={1.2} variant="gradient" gradient={{ from: 'violetBrand.6', to: 'indigo.6', deg: 90 }}>
                Automate your workflow in a single click.
              </Text>
              <Text c="dimmed" size="lg" mt="xl">
                Stop wasting hours on manual data entry. Our platform connects your favorite software pipeline seamlessly so you can focus on building your actual product.
              </Text>
              <Group mt={40}>
                <Button size="lg" gradient={{ from: 'violetBrand.6', to: 'indigo.6' }} variant="gradient">Start free trial</Button>
                <Button size="lg" variant="outline" color="violetBrand.6">Book a live demo</Button>
              </Group>
            </div>
            <div style={{ height: '380px', backgroundColor: 'var(--mantine-color-gray-1)', borderRadius: '24px', border: '1px dashed var(--mantine-color-gray-4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

          {/* Connected Contact Form */}
          <div style={{ marginTop: '120px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <Title order={2} size="32px" fw={800}>Get in Touch</Title>
              <Text c="dimmed" mt="sm">Have questions about our enterprise plans? Send us a message.</Text>
            </div>

            <Card padding="xl" radius="lg" withBorder shadow="sm">
              <form onSubmit={form.onSubmit(handleSubmit)}>
                <TextInput label="Your Name" placeholder="John Doe" required {...form.getInputProps('name')} disabled={loading} />
                <TextInput label="Email Address" placeholder="hello@example.com" required mt="md" {...form.getInputProps('email')} disabled={loading} />
                <Textarea label="Your Message" placeholder="Tell us about your project scale..." required mt="md" minRows={4} {...form.getInputProps('message')} disabled={loading} />

                {success && <Text c="green" size="sm" mt="sm" fw={500}>✓ Message sent successfully into the database backend!</Text>}

                <Button type="submit" fullWidth mt="xl" size="md" gradient={{ from: 'violetBrand.6', to: 'indigo.6' }} variant="gradient" loading={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </Card>
          </div>
        </Container>

        <Box style={{ borderTop: '1px solid var(--mantine-color-gray-2)', backgroundColor: 'var(--mantine-color-gray-0)' }} mt={100} py={40}>
          <Container size="lg">
            <Group justify="between">
              <Text size="sm" c="dimmed">© 2026 MANTINE.io. All rights reserved.</Text>
              <Group gap="xl">
                <Text component="a" href="#" size="sm" c="dimmed">Privacy Policy</Text>
                <Text component="a" href="#" size="sm" c="dimmed">Terms of Service</Text>
              </Group>
            </Group>
          </Container>
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}