"use client";

export const dynamic = "force-dynamic";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Badge } from "@heroui/badge";

export default function HeroUITestPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <h1 className="text-4xl font-neue-montreal-bold text-center mb-12">
          HeroUI Components Test
        </h1>
        
        {/* Button Components Section */}
        <Card className="p-6">
          <CardHeader>
            <h2 className="text-2xl font-neue-montreal-bold">Button Components</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Basic Button */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Basic Button</h3>
                <Button>Click me</Button>
              </div>

              {/* Primary Button */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Primary Button</h3>
                <Button color="primary">Primary</Button>
              </div>

              {/* Secondary Button */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Secondary Button</h3>
                <Button color="secondary">Secondary</Button>
              </div>

              {/* Success Button */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Success Button</h3>
                <Button color="success">Success</Button>
              </div>

              {/* Warning Button */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Warning Button</h3>
                <Button color="warning">Warning</Button>
              </div>

              {/* Danger Button */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Danger Button</h3>
                <Button color="danger">Danger</Button>
              </div>

              {/* Size Variants */}
              <div className="space-y-2 col-span-full">
                <h3 className="text-lg font-medium">Size Variants</h3>
                <div className="flex gap-2 items-center flex-wrap">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              {/* Variant Styles */}
              <div className="space-y-2 col-span-full">
                <h3 className="text-lg font-medium">Variants</h3>
                <div className="flex gap-2 items-center flex-wrap">
                  <Button variant="solid">Solid</Button>
                  <Button variant="bordered">Bordered</Button>
                  <Button variant="light">Light</Button>
                  <Button variant="flat">Flat</Button>
                  <Button variant="faded">Faded</Button>
                  <Button variant="shadow">Shadow</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
              </div>

              {/* Loading States */}
              <div className="space-y-2 col-span-full">
                <h3 className="text-lg font-medium">Loading States</h3>
                <div className="flex gap-2 items-center flex-wrap">
                  <Button isLoading>Loading</Button>
                  <Button isLoading color="primary">Primary Loading</Button>
                  <Button isLoading variant="bordered">Bordered Loading</Button>
                </div>
              </div>

              {/* Disabled */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Disabled</h3>
                <Button isDisabled>Disabled</Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Input Components */}
        <Card className="p-6">
          <CardHeader>
            <h2 className="text-2xl font-neue-montreal-bold">Input Components</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Email" placeholder="Enter your email" type="email" />
              <Input label="Password" placeholder="Enter your password" type="password" />
              <Input label="Search" placeholder="Search..." startContent={<span>🔍</span>} />
              <Input 
                label="Amount" 
                placeholder="0.00" 
                startContent={<span className="text-default-400 text-sm">$</span>}
              />
            </div>
          </CardBody>
        </Card>

        {/* Card Components */}
        <div className="space-y-4">
          <h2 className="text-2xl font-neue-montreal-bold">Card Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <h4 className="font-bold text-large">Default Card</h4>
              </CardHeader>
              <CardBody>
                <p>This is a default card with some content.</p>
              </CardBody>
            </Card>
            
            <Card className="bg-gradient-to-br from-violet-500 to-fuchsia-500">
              <CardHeader>
                <h4 className="font-bold text-large text-white">Gradient Card</h4>
              </CardHeader>
              <CardBody>
                <p className="text-white/80">A beautiful gradient background card.</p>
              </CardBody>
            </Card>
            
            <Card isHoverable>
              <CardHeader>
                <h4 className="font-bold text-large">Hoverable Card</h4>
              </CardHeader>
              <CardBody>
                <p>This card has hover effects enabled.</p>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Avatar Components */}
        <Card className="p-6">
          <CardHeader>
            <h2 className="text-2xl font-neue-montreal-bold">Avatar Components</h2>
          </CardHeader>
          <CardBody>
            <div className="flex gap-4 items-center flex-wrap">
              <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
              <Avatar name="Jane Doe" />
              <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" size="lg" />
              <Avatar name="JD" size="sm" />
              <Badge content="99+" color="danger">
                <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
              </Badge>
            </div>
          </CardBody>
        </Card>

        {/* Badge Components */}
        <Card className="p-6">
          <CardHeader>
            <h2 className="text-2xl font-neue-montreal-bold">Badge Components</h2>
          </CardHeader>
          <CardBody>
            <div className="flex gap-4 items-center flex-wrap">
              <Badge content="New" color="primary">
                <Button>Notifications</Button>
              </Badge>
              <Badge content="5" color="danger">
                <Button>Messages</Button>
              </Badge>
              <Badge content="99+" color="success">
                <Button variant="bordered">Updates</Button>
              </Badge>
              <Badge content="" color="warning" shape="circle">
                <Button>Status</Button>
              </Badge>
            </div>
          </CardBody>
        </Card>

        {/* Combined Example */}
        <Card className="p-6">
          <CardHeader>
            <h2 className="text-2xl font-neue-montreal-bold">Combined Example</h2>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Badge content="Online" color="success" shape="circle">
                  <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" size="lg" />
                </Badge>
                <div className="space-y-1">
                  <h4 className="font-semibold">John Doe</h4>
                  <p className="text-sm text-muted-foreground">Product Manager</p>
                </div>
              </div>
              
              <Input 
                label="Send a message" 
                placeholder="Type your message..." 
                endContent={
                  <Button color="primary" size="sm">
                    Send
                  </Button>
                }
              />
            </div>
          </CardBody>
        </Card>

        <div className="text-center mt-12">
          <p className="text-muted-foreground text-lg">
            🎉 HeroUI is now successfully integrated with your billr project!
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Visit <a href="/heroui-test" className="text-brand hover:underline">/heroui-test</a> to see this page
          </p>
        </div>
      </div>
    </div>
  );
}
