"use client";

import { useState, type ChangeEvent } from 'react';
import { Container, Title, Text, Button, Group, Stack, SimpleGrid, Card, ThemeIcon, AppShell, Burger, TextInput, Textarea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export default function HomePage() {
  const [opened, { toggle }] = useDisclosure();

  type ContactFormValues = {
    name: string;
    email: string;
    message: string;
  };

  const [formValues, setFormValues] = useState<ContactFormValues>({
    name: '',
    email: '',
    message: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ContactFormValues, string>>>({});

  const validateValues = (values: ContactFormValues) => {
    const errors: Partial<Record<keyof ContactFormValues, string>> = {};

    if (values.name.trim().length < 2) {
      errors.name = 'Name must have at least 2 characters';
    }

    if (!/^\S+@\S+\.\S+$/.test(values.email)) {
      errors.email = 'Invalid email address';
    }

    if (values.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long';
    }

    return errors;
  };

  const handleInputChange =
    (field: keyof ContactFormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormValues({ ...formValues, [field]: event.currentTarget.value });
    };

  const handleSubmit = (values: ContactFormValues) => {
    alert(`Form Submitted Successfully!\nName: ${values.name}\nEmail: ${values.email}`);
    setFormValues({ name: '', email: '', message: '' });
    setFormErrors({});
  };

  const form = {
    values: formValues,
    getInputProps: (field: keyof ContactFormValues) => ({
      value: formValues[field],
      onChange: handleInputChange(field),
      error: formErrors[field],
    }),
    onSubmit:
      (submitHandler: (values: ContactFormValues) => void) =>
      (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const errors = validateValues(formValues);
        setFormErrors(errors);

        if (!errors.name && !errors.email && !errors.message) {
          submitHandler(formValues);
        }
      },
    reset: () => {
      setFormValues({ name: '', email: '', message: '' });
      setFormErrors({});
    },
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding="md"
    >
      {/* Global Header Bar */}
      <AppShell.Header>
        <Container size="lg" h="100%">
          <Group justify="between" h="100%">
            <Text fw={900} size="xl" variant="gradient" gradient={{ from: 'violetBrand.6', to: 'indigo.6' }}>
              MANTINE.io
            </Text>

            <Group gap="xl" visibleFrom="sm">
              <Text component="a" href="#" fw={500} size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Features</Text>
              <Text component="a" href="#" fw={500} size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Pricing</Text>
              <Text component="a" href="#" fw={500} size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Docs</Text>
              <Text component="a" href="#" fw={500} size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Company</Text>
            </Group>

            <Group visibleFrom="sm">
              <Button variant="default">Log In</Button>
              <Button gradient={{ from: 'violetBrand.6', to: 'indigo.6' }} variant="gradient">Get Started</Button>
            </Group>

            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          </Group>
        </Container>
      </AppShell.Header>

      {/* Side Mobile Navigation Drawer Menu */}
      <AppShell.Navbar p="md">
        <Stack style={{ width: '100%', gap: 16 }}>
          <Button variant="subtle" fullWidth color="gray">Features</Button>
          <Button variant="subtle" fullWidth color="gray">Pricing</Button>
          <Button variant="subtle" fullWidth color="gray">Docs</Button>
          <Button variant="subtle" fullWidth color="gray">Company</Button>
          <Button variant="default" fullWidth mt="md">Log In</Button>
          <Button gradient={{ from: 'violetBrand.6', to: 'indigo.6' }} variant="gradient" fullWidth>Get Started</Button>
        </Stack>
      </AppShell.Navbar>

      {/* Main Landing Page Sections Wrapper */}
      <AppShell.Main pt={60}>
        <Container size="lg" py={60}>
          
          {/* Hero Section */}
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={50} style={{ alignItems: 'center' }}>
            <div>
              <Text
                component="h1"
                size="calc(2rem + 1.5vw)"
                fw={900}
                lh={1.2}
                variant="gradient"
                gradient={{ from: 'violetBrand.6', to: 'indigo.6', deg: 90 }}
              >
                Automate your workflow in a single click.
              </Text>
              
              <Text c="dimmed" size="lg" mt="xl">
                Stop wasting hours on manual data entry. Our platform connects your favorite software pipeline seamlessly so you can focus on building your actual product.
              </Text>

              <Group mt={40}>
                <Button size="lg" gradient={{ from: 'violetBrand.6', to: 'indigo.6' }} variant="gradient">
                  Start free trial
                </Button>
                <Button size="lg" variant="outline" color="violetBrand.6">
                  Book a live demo
                </Button>
              </Group>
            </div>

            <div style={{ 
              height: '380px', 
              backgroundColor: 'var(--mantine-color-gray-1)', 
              borderRadius: '24px',
              border: '1px dashed var(--mantine-color-gray-4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Text c="gray.5" fw={500}>[ Product Dashboard Mockup Preview ]</Text>
            </div>
          </SimpleGrid>

          {/* Features Grid Section */}
          <div style={{ marginTop: '120px' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <Title order={2} size="32px" fw={800}>Everything you need to scale</Title>
              <Text c="dimmed" mt="sm" maw={600} mx="auto">
                Our platform includes all the enterprise-ready infrastructure integrations out of the box.
              </Text>
            </div>

            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
              <Card shadow="sm" padding="xl" withBorder>
                <ThemeIcon variant="light" size="xl" radius="md" color="violetBrand.6">⚡</ThemeIcon>
                <Text fw={700} size="lg" mt="md">Real-time Analytics</Text>
                <Text size="sm" c="dimmed" mt="sm" lh={1.5}>
                  Track performance metrics immediately as they happen. Never make decisions blindly again.
                </Text>
              </Card>

              <Card shadow="sm" padding="xl" withBorder>
                <ThemeIcon variant="light" size="xl" radius="md" color="violetBrand.4">🔒</ThemeIcon>
                <Text fw={700} size="lg" mt="md">Secure Encryption</Text>
                <Text size="sm" c="dimmed" mt="sm" lh={1.5}>
                  Your data is fully encrypted both in transit and at rest with bank-grade security protocols.
                </Text>
              </Card>

              <Card shadow="sm" padding="xl" withBorder>
                <ThemeIcon variant="light" size="xl" radius="md" color="indigo.6">⚙️</ThemeIcon>
                <Text fw={700} size="lg" mt="md">Easy Integrations</Text>
                <Text size="sm" c="dimmed" mt="sm" lh={1.5}>
                  Connect seamlessly to Slack, Discord, GitHub, and over 2,000 other apps using our visual builder.
                </Text>
              </Card>
            </SimpleGrid>
          </div>

          {/* Pricing Section */}
          <div style={{ marginTop: '120px' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <Title order={2} size="32px" fw={800}>Simple, predictable pricing</Title>
              <Text c="dimmed" mt="sm">All plans come with a 14-day trial. No credit card required.</Text>
            </div>

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" maw={800} mx="auto">
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
                  <Text size="sm" mt="xs" fw={500}>✓ Advanced user team permissions</Text>
                </div>
                <Button variant="gradient" gradient={{ from: 'violetBrand.6', to: 'indigo.6' }} fullWidth>Choose Pro</Button>
              </Card>
            </SimpleGrid>
          </div>

          {/* 3. Interactive Contact Form Section */}
          <div style={{ marginTop: '120px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            <Card shadow="md" padding="xl" radius="lg" withBorder>
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <Title order={2} size="28px" fw={800}>Have questions? Get in touch</Title>
                <Text c="dimmed" size="sm" mt="xs">We typically respond to inquiries within 24 business hours.</Text>
              </div>

              {/* Form Element linked to Mantine Form Handler */}
            </Card>
          </div>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
