import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button-toggle';
import { Badge } from '@/components/ui/badge';
import { Download, Calendar, TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart } from 'lucide-react';
import { AnimatedBeam } from '@/components/magicui/animated-beam';
import { AnimatedList } from '@/components/magicui/animated-list';
import { OrbitingCircles } from '@/components/magicui/orbiting-circles';
import NumberTicker from '@/components/magicui/number-ticker';

// Mock data for the dashboard
const metrics = [
  {
    title: "New Subscriptions",
    value: 4682,
    change: "+15.54%",
    trend: "up",
    subtitle: "Since Last week",
    icon: Users
  },
  {
    title: "New Orders", 
    value: 1226,
    change: "-40.2%",
    trend: "down",
    subtitle: "Since Last week",
    icon: ShoppingCart
  },
  {
    title: "Avg Order Revenue",
    value: 1080,
    change: "+10.8%", 
    trend: "up",
    subtitle: "Since Last week",
    icon: DollarSign
  }
];

const recentPayments = [
  { id: 1, status: "Success", email: "ken99@yahoo.com", amount: "$316.00" },
  { id: 2, status: "Success", email: "abe45@gmail.com", amount: "$242.00" },
  { id: 3, status: "Processing", email: "monserrat44@gmail.com", amount: "$837.00" },
  { id: 4, status: "Failed", email: "carmela@hotmail.com", amount: "$721.00" },
];

const teamMembers = [
  { name: "Dale Kemen", email: "dale@example.com", role: "Member", avatar: "👨‍💼" },
  { name: "Sofia Davis", email: "m@example.com", role: "Owner", avatar: "👩‍💼" },
  { name: "Jackson Lee", email: "p@example.com", role: "Member", avatar: "👨‍🎓" },
  { name: "Isabella Nguyen", email: "i@example.com", role: "Member", avatar: "👩‍🎨" },
  { name: "Hugon Romex", email: "will@example.com", role: "Member", avatar: "👨‍🔬" },
];

export default function AIChartPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <div className="flex items-center space-x-4 mt-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Overview
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Analytics
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Reports
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Notifications
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Pick a date
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <metric.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <NumberTicker value={metric.value} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{metric.subtitle}</p>
                <div className="mt-2 flex items-center space-x-2">
                  <Badge 
                    variant={metric.trend === "up" ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {metric.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {metric.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Total Revenue Card with Orbiting Circles */}
          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $<NumberTicker value={15231.89} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">+20.1% from last month</p>
              <div className="mt-4 relative h-16">
                <OrbitingCircles
                  className="size-[30px] border-none bg-transparent"
                  duration={40}
                  delay={20}
                  radius={30}
                  speed={0.5}
                >
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </OrbitingCircles>
                <OrbitingCircles
                  className="size-[30px] border-none bg-transparent"
                  duration={40}
                  delay={10}
                  radius={30}
                  speed={0.5}
                >
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                </OrbitingCircles>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Activity Chart */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Sale Activity - Monthly</CardTitle>
              <CardDescription>Showing total sales for the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {/* Placeholder for chart - you can integrate actual charting library */}
                <div className="h-full w-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-muted-foreground mb-2">📊</div>
                    <p className="text-muted-foreground">Chart visualization here</p>
                    <p className="text-xs text-muted-foreground mt-1">Integrate with Chart.js, Recharts, or similar</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscriptions */}
          <Card>
            <CardHeader>
              <CardTitle>Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                +<NumberTicker value={2350} />
              </div>
              <p className="text-xs text-muted-foreground">+180.1% from last month</p>
              
              {/* Bar Chart Placeholder */}
              <div className="mt-6 space-y-2">
                {[40, 80, 60, 90, 70, 85, 95, 75, 88, 92, 78, 100].map((height, i) => (
                  <div key={i} className="flex items-end justify-between">
                    <div 
                      className={`w-8 rounded-sm ${i % 2 === 0 ? 'bg-orange-500' : 'bg-green-500'}`}
                      style={{ height: `${height * 0.8}px` }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payments Table */}
          <Card>
            <CardHeader>
              <CardTitle>Payments</CardTitle>
              <CardDescription>Manage your payments.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AnimatedList>
                  {recentPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <div>
                          <Badge 
                            variant={
                              payment.status === "Success" ? "default" :
                              payment.status === "Processing" ? "secondary" : "destructive"
                            }
                            className="text-xs"
                          >
                            {payment.status}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">{payment.email}</p>
                        </div>
                      </div>
                      <div className="font-medium">{payment.amount}</div>
                    </div>
                  ))}
                </AnimatedList>
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Invite your team members to collaborate.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AnimatedList>
                  {teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{member.avatar}</div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{member.role}</Badge>
                    </div>
                  ))}
                </AnimatedList>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
