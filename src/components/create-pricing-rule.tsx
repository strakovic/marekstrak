"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DollarSign, 
  Layers, 
  Percent, 
  Calendar, 
  Code,
  Plus,
  Trash2,
  Info,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

type RuleType = "flat" | "tiered" | "conditional" | "seasonal" | "custom";

interface Tier {
  id: string;
  min: string;
  max: string;
  price: string;
}

export default function CreatePricingRule() {
  const [selectedRule, setSelectedRule] = useState<RuleType>("flat");
  const [formData, setFormData] = useState({
    // Flat Rate
    flatAmount: "99",
    billingCycle: "monthly",
    
    // Tiered Usage
    tiers: [
      { id: "1", min: "0", max: "1000", price: "0.10" },
      { id: "2", min: "1001", max: "5000", price: "0.08" },
    ] as Tier[],
    
    // Conditional Discount
    conditionType: "usage",
    conditionValue: "10000",
    conditionPlan: "PRO",
    discountType: "percentage",
    discountValue: "20",
    
    // Seasonal Cap
    startDate: "",
    endDate: "",
    maxCharge: "5000",
    
    // Custom Formula
    customFormula: `// Advanced pricing logic
if (usage > 10000 && plan === "PRO") {
  return usage * 0.007;
} else {
  return usage * 0.01;
}`,
  });

  const ruleTypes = [
    { 
      value: "flat" as const, 
      label: "Flat Rate", 
      icon: DollarSign,
      description: "Simple fixed pricing per billing cycle",
      example: "$99/month for unlimited access"
    },
    { 
      value: "tiered" as const, 
      label: "Tiered Usage", 
      icon: Layers,
      description: "Volume-based pricing with multiple tiers",
      example: "First 1000 units at $0.10, next 4000 at $0.08"
    },
    { 
      value: "conditional" as const, 
      label: "Conditional", 
      icon: Percent,
      description: "Apply discounts based on conditions",
      example: "20% off for PRO users over 10K usage"
    },
    { 
      value: "seasonal" as const, 
      label: "Seasonal Cap", 
      icon: Calendar,
      description: "Time-based pricing with spend limits",
      example: "Holiday special: Max $5000/month Dec-Jan"
    },
    { 
      value: "custom" as const, 
      label: "Custom Formula", 
      icon: Code,
      description: "Write custom pricing logic in code",
      example: "Complex multi-variable pricing algorithms"
    },
  ];

  const handleAddTier = () => {
    const lastTier = formData.tiers[formData.tiers.length - 1];
    const newMin = lastTier ? (parseInt(lastTier.max) + 1).toString() : "0";
    setFormData({
      ...formData,
      tiers: [
        ...formData.tiers,
        { 
          id: Date.now().toString(), 
          min: newMin, 
          max: (parseInt(newMin) + 1000).toString(), 
          price: "0.05" 
        },
      ],
    });
  };

  const handleRemoveTier = (id: string) => {
    setFormData({
      ...formData,
      tiers: formData.tiers.filter((tier) => tier.id !== id),
    });
  };

  const handleTierChange = (id: string, field: keyof Tier, value: string) => {
    setFormData({
      ...formData,
      tiers: formData.tiers.map((tier) =>
        tier.id === id ? { ...tier, [field]: value } : tier
      ),
    });
  };

  const previewText = useMemo(() => {
    switch (selectedRule) {
      case "flat":
        return `Charge $${formData.flatAmount} per ${formData.billingCycle === "monthly" ? "month" : "year"} for all users.`;
      case "tiered":
        const tierText = formData.tiers
          .map((t) => `${t.min}-${t.max} units at $${t.price}/unit`)
          .join(", ");
        return `Tiered pricing: ${tierText}`;
      case "conditional":
        return `If ${formData.conditionType} > ${formData.conditionValue} and plan is ${formData.conditionPlan}, apply ${formData.discountValue}${formData.discountType === "percentage" ? "%" : "$"} discount.`;
      case "seasonal":
        return `Between ${formData.startDate || "start date"} and ${formData.endDate || "end date"}, cap charges at $${formData.maxCharge}/month.`;
      case "custom":
        return "Custom pricing logic will be evaluated based on your formula.";
      default:
        return "Select a rule type to see preview";
    }
  }, [selectedRule, formData]);

  return (
    <Card className="w-full h-full max-w-[1000px] max-h-[500px] mx-auto border-0 shadow-none bg-transparent">
      <CardContent className="p-0 h-full">
        <div className="flex flex-col lg:flex-row gap-4 h-full">
          {/* Left Panel - Rule Type Selection */}
          <div className="w-full lg:w-1/3 space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-neue-montreal-medium text-muted-foreground">Select Rule Type</h3>
              <ToggleGroup
                type="single"
                value={selectedRule}
                onValueChange={(value) => value && setSelectedRule(value as RuleType)}
                className="flex flex-col gap-2"
              >
                {ruleTypes.map((rule) => (
                  <HoverCard key={rule.value}>
                    <HoverCardTrigger asChild>
                      <ToggleGroupItem
                        value={rule.value}
                        className={cn(
                          "w-full justify-start gap-3 h-auto py-3 px-4",
                          "data-[state=on]:bg-[#F9620C]/10 data-[state=on]:text-[#F9620C]",
                          "data-[state=on]:border-[#F9620C]/20",
                          "hover:bg-muted/50"
                        )}
                      >
                        <rule.icon className="h-4 w-4 shrink-0" />
                        <span className="font-neue-montreal-medium">{rule.label}</span>
                      </ToggleGroupItem>
                    </HoverCardTrigger>
                    <HoverCardContent side="right" className="w-80">
                      <div className="space-y-2">
                        <h4 className="text-sm font-neue-montreal-medium">{rule.label}</h4>
                        <p className="text-sm text-muted-foreground font-neue-montreal-book">
                          {rule.description}
                        </p>
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground font-mono">{rule.example}</p>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ))}
              </ToggleGroup>
            </div>
          </div>

          {/* Right Panel - Dynamic Form Fields */}
          <div className="flex-1 space-y-4">
            <ScrollArea className="h-full max-h-[350px] lg:max-h-[400px] pr-4">
              <div className="space-y-4">
                {/* Flat Rate Form */}
                {selectedRule === "flat" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="font-neue-montreal-medium">Amount</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="amount"
                          type="number"
                          value={formData.flatAmount}
                          onChange={(e) => setFormData({ ...formData, flatAmount: e.target.value })}
                          className="pl-10"
                          placeholder="99.00"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cycle" className="font-neue-montreal-medium">Billing Cycle</Label>
                      <Select
                        value={formData.billingCycle}
                        onValueChange={(value) => setFormData({ ...formData, billingCycle: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Tiered Usage Form */}
                {selectedRule === "tiered" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="font-neue-montreal-medium">Pricing Tiers</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleAddTier}
                        className="h-8 gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Add Tier
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {formData.tiers.map((tier, index) => (
                        <div key={tier.id} className="flex gap-2 items-end">
                          <div className="flex-1 space-y-1">
                            <Label className="text-xs">Min Units</Label>
                            <Input
                              type="number"
                              value={tier.min}
                              onChange={(e) => handleTierChange(tier.id, "min", e.target.value)}
                              className="h-9"
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            <Label className="text-xs">Max Units</Label>
                            <Input
                              type="number"
                              value={tier.max}
                              onChange={(e) => handleTierChange(tier.id, "max", e.target.value)}
                              className="h-9"
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            <Label className="text-xs">$/Unit</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={tier.price}
                              onChange={(e) => handleTierChange(tier.id, "price", e.target.value)}
                              className="h-9"
                            />
                          </div>
                          {formData.tiers.length > 1 && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveTier(tier.id)}
                              className="h-9 w-9 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Conditional Discount Form */}
                {selectedRule === "conditional" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="font-neue-montreal-medium">Condition</Label>
                      <div className="flex gap-2">
                        <Select
                          value={formData.conditionType}
                          onValueChange={(value) => setFormData({ ...formData, conditionType: value })}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="usage">Usage</SelectItem>
                            <SelectItem value="plan">Plan</SelectItem>
                            <SelectItem value="tags">Tags</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="Value"
                          value={formData.conditionValue}
                          onChange={(e) => setFormData({ ...formData, conditionValue: e.target.value })}
                        />
                        <Select
                          value={formData.conditionPlan}
                          onValueChange={(value) => setFormData({ ...formData, conditionPlan: value })}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PRO">PRO</SelectItem>
                            <SelectItem value="TEAM">TEAM</SelectItem>
                            <SelectItem value="ENTERPRISE">ENTERPRISE</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-neue-montreal-medium">Discount</Label>
                      <div className="flex gap-2">
                        <Select
                          value={formData.discountType}
                          onValueChange={(value) => setFormData({ ...formData, discountType: value })}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">Percentage</SelectItem>
                            <SelectItem value="fixed">Fixed Amount</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          placeholder="20"
                          value={formData.discountValue}
                          onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Seasonal Cap Form */}
                {selectedRule === "seasonal" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="font-neue-montreal-medium">Date Range</Label>
                      <div className="flex gap-2">
                        <Input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        />
                        <span className="self-center text-muted-foreground">to</span>
                        <Input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxCharge" className="font-neue-montreal-medium">Maximum Charge Limit</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="maxCharge"
                          type="number"
                          value={formData.maxCharge}
                          onChange={(e) => setFormData({ ...formData, maxCharge: e.target.value })}
                          className="pl-10"
                          placeholder="5000"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Custom Formula Form */}
                {selectedRule === "custom" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="font-neue-montreal-medium">Custom Pricing Formula</Label>
                      <Textarea
                        value={formData.customFormula}
                        onChange={(e) => setFormData({ ...formData, customFormula: e.target.value })}
                        className="min-h-[200px] font-mono text-sm"
                        placeholder="// Write your custom pricing logic here"
                      />
                    </div>
                  </div>
                )}

                {/* Live Preview */}
                <Alert className="border-[#F9620C]/20 bg-[#F9620C]/5">
                  <Sparkles className="h-4 w-4 text-[#F9620C]" />
                  <AlertDescription className="text-sm font-neue-montreal-book">
                    <span className="font-neue-montreal-medium text-[#F9620C]">Preview:</span> {previewText}
                  </AlertDescription>
                </Alert>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1">
                    Save as Draft
                  </Button>
                  <Button className="flex-1 bg-[#F9620C] hover:bg-[#F9620C]/90 text-white">
                    Apply Rule
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}