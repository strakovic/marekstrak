"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Badge } from "@heroui/badge";
import { 
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@heroui/dropdown";
import { useState, useEffect } from "react";
import { HeroUIIcon, Edit, Dollar, Card as CardIcon, User, Users, Chart } from "@/components/ui/heroui-icon";
import NumberTicker from "@/components/magicui/number-ticker";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  category: "tokens" | "compute" | "storage" | "bandwidth";
  dailyUsage?: number; // For prediction calculations
  growthRate?: number; // Daily growth rate in percentage
}

interface Client {
  id: string;
  name: string;
  email: string;
  avatar: string;
  company: string;
}

interface BillingPeriod {
  startDate: Date;
  endDate: Date;
  daysElapsed: number;
  daysRemaining: number;
  totalDays: number;
}

const mockInvoiceItems: InvoiceItem[] = [
  {
    id: "1",
    description: "AI Model Inference - GPT-4 Turbo",
    quantity: 150000,
    rate: 0.03,
    amount: 4500,
    category: "tokens",
    dailyUsage: 10000, // 10k tokens per day average
    growthRate: 0.08 // 8% daily growth
  },
  {
    id: "2", 
    description: "Claude 3 Sonnet Processing",
    quantity: 85000,
    rate: 0.015,
    amount: 1275,
    category: "tokens",
    dailyUsage: 5667, // ~85k/15 days
    growthRate: 0.05 // 5% daily growth
  },
  {
    id: "3",
    description: "GPU Compute Hours - A100",
    quantity: 24,
    rate: 2.50,
    amount: 60,
    category: "compute",
    dailyUsage: 1.6, // 1.6 hours per day
    growthRate: 0.03 // 3% daily growth
  },
  {
    id: "4",
    description: "Vector Database Storage",
    quantity: 500,
    rate: 0.10,
    amount: 50,
    category: "storage",
    dailyUsage: 33.33, // Storage grows by 33GB daily
    growthRate: 0.02 // 2% daily growth
  }
];

const mockClient: Client = {
  id: "1",
  name: "Sarah Chen",
  email: "sarah@techcorp.com",
  avatar: "https://i.pravatar.cc/150?u=sarah",
  company: "TechCorp AI"
};

// Calculate billing period (15 days elapsed, 15 days remaining in a 30-day cycle)
const getBillingPeriod = (): BillingPeriod => {
  const startDate = new Date(2024, 0, 1); // Jan 1, 2024
  const endDate = new Date(2024, 0, 31); // Jan 31, 2024
  const currentDate = new Date(2024, 0, 16); // Jan 16, 2024 (15 days elapsed)
  
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysElapsed = Math.ceil((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysRemaining = totalDays - daysElapsed;
  
  return {
    startDate,
    endDate,
    daysElapsed,
    daysRemaining,
    totalDays
  };
};

// Prediction algorithm based on usage patterns and growth
const calculatePrediction = (item: InvoiceItem, daysRemaining: number): number => {
  if (!item.dailyUsage || !item.growthRate) return item.amount;
  
  let projectedUsage = 0;
  let currentDailyUsage = item.dailyUsage;
  
  // Calculate projected usage for remaining days with compound growth
  for (let day = 1; day <= daysRemaining; day++) {
    projectedUsage += currentDailyUsage;
    currentDailyUsage *= (1 + item.growthRate); // Apply growth rate
  }
  
  // Calculate projected cost
  const projectedCost = (projectedUsage * item.rate) / (item.category === "tokens" ? 1000 : 1);
  return item.amount + projectedCost;
};

// Generate random invoice data for "sent" effect
const generateRandomInvoiceData = (): InvoiceItem[] => {
  const baseItems = [...mockInvoiceItems];
  return baseItems.map(item => ({
    ...item,
    quantity: Math.floor(item.quantity * (0.8 + Math.random() * 0.4)), // ±20% variance
    amount: Math.floor(item.amount * (0.8 + Math.random() * 0.4) * 100) / 100,
    dailyUsage: item.dailyUsage ? item.dailyUsage * (0.9 + Math.random() * 0.2) : undefined,
    growthRate: item.growthRate ? Math.max(0.01, item.growthRate + (Math.random() - 0.5) * 0.02) : undefined
  }));
};

export default function InvoiceDashboard() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [invoiceItems, setInvoiceItems] = useState(mockInvoiceItems);
  const [isSending, setIsSending] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("INV-2024-001");
  
  const billingPeriod = getBillingPeriod();
  const subtotal = invoiceItems.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;
  
  // Calculate predicted total for end of billing period
  const predictedSubtotal = invoiceItems.reduce((sum, item) => {
    return sum + calculatePrediction(item, billingPeriod.daysRemaining);
  }, 0);
  const predictedTax = predictedSubtotal * 0.1;
  const predictedTotal = predictedSubtotal + predictedTax;
  
  // Handle sending invoice with animation effect
  const handleSendInvoice = async () => {
    setIsSending(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate new random invoice data
    const newInvoiceData = generateRandomInvoiceData();
    const newInvoiceNum = `INV-2024-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`;
    
    setInvoiceItems(newInvoiceData);
    setInvoiceNumber(newInvoiceNum);
    setIsSending(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "tokens": return "primary";
      case "compute": return "success"; 
      case "storage": return "warning";
      case "bandwidth": return "secondary";
      default: return "default";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "tokens": 
        return <HeroUIIcon category="Network, IT, Programming" name="Programming" size={16} />;
      case "compute":
        return <HeroUIIcon category="Electronic, Devices" name="CPU" size={16} />;
      case "storage":
        return <HeroUIIcon category="Electronic, Devices" name="Database" size={16} />;
      case "bandwidth":
        return <HeroUIIcon category="Network, IT, Programming" name="Wi-Fi Router Round" size={16} />;
      default:
        return <HeroUIIcon category="Essentional, UI" name="Document Text" size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-neue-montreal-bold bg-gradient-to-r from-brand to-brand-foreground bg-clip-text text-transparent">
              Invoice #{invoiceNumber}
            </h1>
            <p className="text-muted-foreground mt-2">
              AI Services Billing Dashboard • {billingPeriod.daysElapsed} days elapsed, {billingPeriod.daysRemaining} days remaining
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="bordered" 
              startContent={<Edit />}
              onPress={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Save Changes" : "Edit Invoice"}
            </Button>
            <Button 
              color="primary" 
              startContent={<HeroUIIcon category="Files" name="Document" size={16} />}
            >
              Export PDF
            </Button>
          </div>
        </div>

        {/* Client & Invoice Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Client Information */}
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
            <CardHeader className="relative">
              <div className="flex items-center gap-3">
                <HeroUIIcon category="Users" name="User" size={20} className="text-primary" />
                <h3 className="text-xl font-neue-montreal-bold">Client Information</h3>
              </div>
            </CardHeader>
            <CardBody className="relative">
              <div className="flex items-center gap-4">
                <Avatar src={mockClient.avatar} size="lg" />
                <div className="space-y-1">
                  <h4 className="font-semibold text-lg">{mockClient.name}</h4>
                  <p className="text-sm text-muted-foreground">{mockClient.company}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <HeroUIIcon category="Messages, Conversation" name="Letter" size={14} />
                    {mockClient.email}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Invoice Totals */}
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-bl from-success/5 via-transparent to-transparent" />
            <CardHeader className="relative">
              <div className="flex items-center gap-3">
                <Dollar className="text-success" />
                <h3 className="text-xl font-neue-montreal-bold">Invoice Summary</h3>
              </div>
            </CardHeader>
            <CardBody className="relative space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Current Subtotal ({billingPeriod.daysElapsed} days)</span>
                <span className="font-mono">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tax (10%)</span>
                <span className="font-mono">${tax.toFixed(2)}</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Current Total</span>
                <div className="flex items-center gap-3">
                  <NumberTicker value={total} className="font-mono text-2xl text-brand" />
                  <span className="font-mono text-2xl text-brand">USD</span>
                </div>
              </div>
              <div className="h-px bg-border opacity-50" />
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <HeroUIIcon category="Business, Statistic" name="Graph Up" size={14} />
                  Projected End-of-Period
                </span>
                <div className="flex items-center gap-2">
                  <NumberTicker 
                    value={predictedTotal} 
                    className="font-mono text-lg text-muted-foreground font-bold" 
                    decimalPlaces={2}
                  />
                  <span className="font-mono text-lg text-muted-foreground font-bold">USD</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Invoice Items Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Chart className="text-primary" />
                <h3 className="text-xl font-neue-montreal-bold">Line Items</h3>
              </div>
              {isEditing && (
                <Button 
                  size="sm" 
                  color="primary" 
                  variant="flat"
                  startContent={<HeroUIIcon category="Essentional, UI" name="Add Circle" size={16} />}
                >
                  Add Item
                </Button>
              )}
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-1">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 p-3 text-sm font-medium text-muted-foreground border-b">
                <div className="col-span-5">Description</div>
                <div className="col-span-2 text-right">Quantity</div>
                <div className="col-span-2 text-right">Rate</div>
                <div className="col-span-2 text-right">Amount</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>

              {/* Table Rows */}
              {invoiceItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className="grid grid-cols-12 gap-4 p-3 hover:bg-muted/50 rounded-lg transition-colors group"
                >
                  <div className="col-span-5 space-y-1">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(item.category)}
                      <span className="font-medium">{item.description}</span>
                      <Badge 
                        size="sm" 
                        color={getCategoryColor(item.category)}
                        variant="flat"
                      >
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="col-span-2 text-right">
                    {isEditing ? (
                      <Input 
                        size="sm" 
                        value={item.quantity.toString()}
                        className="w-20 ml-auto"
                      />
                    ) : (
                      <span className="font-mono">
                        {item.category === "tokens" 
                          ? `${item.quantity.toLocaleString()} tokens`
                          : `${item.quantity} ${item.category === "compute" ? "hrs" : "GB"}`
                        }
                      </span>
                    )}
                  </div>
                  
                  <div className="col-span-2 text-right">
                    {isEditing ? (
                      <Input 
                        size="sm" 
                        value={item.rate.toString()}
                        startContent="$"
                        className="w-24 ml-auto"
                      />
                    ) : (
                      <span className="font-mono">
                        ${item.rate.toFixed(item.category === "tokens" ? 3 : 2)}
                        {item.category === "tokens" && <span className="text-muted-foreground text-xs ml-1">/1k</span>}
                      </span>
                    )}
                  </div>
                  
                  <div className="col-span-2 text-right">
                    <span className="font-mono font-semibold text-brand">
                      ${item.amount.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="col-span-1 text-right">
                    <Dropdown>
                      <DropdownTrigger>
                        <Button 
                          isIconOnly 
                          size="sm" 
                          variant="light"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <HeroUIIcon category="Essentional, UI" name="Menu Dots" size={16} />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownItem 
                          key="edit"
                          startContent={<Edit size={14} />}
                        >
                          Edit Item
                        </DropdownItem>
                        <DropdownItem 
                          key="duplicate"
                          startContent={<HeroUIIcon category="Essentional, UI" name="Copy" size={14} />}
                        >
                          Duplicate
                        </DropdownItem>
                        <DropdownItem 
                          key="delete"
                          color="danger" 
                          startContent={<HeroUIIcon category="Essentional, UI" name="Trash Bin Minimalistic" size={14} />}
                        >
                          Delete
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <CardIcon className="text-primary" />
              <h3 className="text-xl font-neue-montreal-bold">Payment Details</h3>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <div className="flex items-center gap-2">
                  <HeroUIIcon category="Money" name="Card" size={16} />
                  <span className="font-medium">•••• •••• •••• 4242</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Due Date</p>
                <div className="flex items-center gap-2">
                  <HeroUIIcon category="Time" name="Calendar" size={16} />
                  <span className="font-medium">January 30, 2024</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge color="warning" variant="flat">
                  Pending Payment
                </Badge>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button variant="bordered">
            <HeroUIIcon category="Messages, Conversation" name="Letter" size={16} />
            Send Reminder
          </Button>
          <Button variant="bordered">
            <HeroUIIcon category="Essentional, UI" name="Copy" size={16} />
            Duplicate Invoice
          </Button>
          <Button color="success">
            <HeroUIIcon category="Money" name="Card Send" size={16} />
            Mark as Paid
          </Button>
        </div>
      </div>
    </div>
  );
}
