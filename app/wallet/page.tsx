"use client"

import { useState } from "react"
import {
  Wallet,
  CreditCard,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Eye,
  EyeOff,
  Gift,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Upload,
  Repeat,
  Settings,
  MoreHorizontal,
  ChevronLeft,
} from "lucide-react"
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const mockTransactions = [
  
  {
    id: 1,
    type: "deposit",
    category: "bank_to_wallet",
    description: "Added ₹500 from HDFC Bank",
    amount: 500.0,
    date: "2024-01-17",
    status: "completed",
    bankName: "HDFC Bank",
  },

  {
    id: 2,
    type: "withdrawal",
    category: "wallet_to_bank",
    description: "Withdrawn ₹250 to Axis Bank",
    amount: -250.0,
    date: "2024-01-16",
    status: "completed",
    bankName: "Axis Bank",
  },

 
  {
    id: 3,
    type: "spending",
    category: "wallet_to_app",
    description: "Boosted video 'React Tutorial'",
    amount: -40.0,
    date: "2024-01-15",
    status: "completed",
    videoTitle: "React Tutorial",
  },

  {
    id: 4,
    type: "spending",
    category: "wallet_to_app",
    description: "Purchased premium content - 'Next.js Advanced'",
    amount: -20.0,
    date: "2024-01-14",
    status: "completed",
    contentTitle: "Next.js Advanced",
  },

  {
    id: 5,
    type: "spending",
    category: "wallet_to_app",
    description: "Tipped creator - John Doe",
    amount: -10.0,
    date: "2024-01-13",
    status: "completed",
    tipperName: "John Doe",
  },
]


const mockEarningsSources = [
  { source: "Video Monetization", amount: 156.75, percentage: 45, growth: 12 },
  { source: "Tips & Donations", amount: 89.5, percentage: 26, growth: 8 },
  { source: "Premium Content", amount: 67.25, percentage: 19, growth: 15 },
  { source: "Live Streaming", amount: 35.0, percentage: 10, growth: -3 },
]

const mockPaymentMethods = [
  { id: 1, type: "bank", name: "HDFC Bank", details: "****1234", isDefault: true },
  { id: 2, type: "upi", name: "UPI", details: "user@paytm", isDefault: false },
  { id: 3, type: "wallet", name: "Paytm Wallet", details: "****5678", isDefault: false },
]

export default function WalletPage() {
  const [balance] = useState(348.5)
  const [pendingBalance] = useState(25.75)
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [showBalance, setShowBalance] = useState(true)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("1")
  const [activeTab, setActiveTab] = useState("overview")
   const router = useRouter();

  const totalEarnings = mockEarningsSources.reduce((sum, source) => sum + source.amount, 0)

  const getTransactionIcon = (transaction: any) => {
    switch (transaction.category) {
      case "video_monetization":
        return <TrendingUp size={16} className="text-green-600" />
      case "tips":
        return <Gift size={16} className="text-purple-600" />
      case "premium_content":
        return <Star size={16} className="text-yellow-600" />
      case "live_stream":
        return <Upload size={16} className="text-blue-600" />
      case "bank_transfer":
        return <ArrowUpRight size={16} className="text-red-600" />
      case "boost_video":
        return <TrendingUp size={16} className="text-orange-600" />
      default:
        return <DollarSign size={16} />
    }
  }

 const getStatusBadge = (status: string) => {
  const baseClasses =
    "inline-flex items-center gap-1 text-[10px] font-medium px-2 py-[2px] rounded-full border select-none";

  switch (status) {
    case "completed":
      return (
        <Badge className={`${baseClasses} bg-green-500/10 text-green-400 border-green-500/20`}>
          <CheckCircle size={12} className="mr-1" />
          Completed
        </Badge>
      );
    case "pending":
      return (
        <Badge className={`${baseClasses} bg-yellow-500/10 text-yellow-400 border-yellow-500/20`}>
          <Clock size={12} className="mr-1" />
          Pending
        </Badge>
      );
    case "failed":
      return (
        <Badge className={`${baseClasses} bg-red-500/10 text-red-400 border-red-500/20`}>
          <XCircle size={12} className="mr-1" />
          Failed
        </Badge>
      );
    default:
      return (
        <Badge className={`${baseClasses} bg-gray-500/10 text-white border-gray-600/20`}>
          {status}
        </Badge>
      );
  }
};


  return (
    <>
    {/* Desktop version */}
    <div className="hidden md:block">
    <div className="p-4 pb-20 md:pb-4 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Wallet size={32} className="text-primary" />
          <h1 className="text-3xl font-bold">Wallet</h1>
        </div>
        <Button variant="outline" size="icon" className="border-gray-600">
       <Settings size={16} className="text-white" />
       </Button>

      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowBalance(!showBalance)} className="h-6 w-6 p-0">
              {showBalance ? <Eye size={14} /> : <EyeOff size={14} />}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{showBalance ? `₹${balance.toFixed(2)}` : "₹****"}</div>
            <p className="text-xs text-muted-foreground">Ready for withdrawal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Earnings</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{pendingBalance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Processing (2-3 days)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹89.24</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time earnings</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="payments">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center space-y-2">
              <ArrowDownLeft size={20} />
              <span className="text-sm">Withdraw</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <TrendingUp size={20} />
              <span className="text-sm">Boost Video</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Gift size={20} />
              <span className="text-sm">Send Tip</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Download size={20} />
              <span className="text-sm">Export</span>
            </Button>
          </div>

          {/* Earnings Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Earnings Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockEarningsSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        {getTransactionIcon({ category: source.source.toLowerCase().replace(" ", "_") })}
                      </div>
                      <div>
                        <p className="font-medium">{source.source}</p>
                        <p className="text-sm text-muted-foreground">{source.percentage}% of total</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{source.amount.toFixed(2)}</p>
                      <p className={`text-sm ${source.growth >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {source.growth >= 0 ? "+" : ""}
                        {source.growth}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockTransactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-muted">{getTransactionIcon(transaction)}</div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{transaction.date}</span>
                          <span>•</span>
                          <span className="capitalize">{transaction.category.replace("_", " ")}</span>
                        </div>
                        {transaction.videoTitle && (
                          <p className="text-sm text-muted-foreground">Video: {transaction.videoTitle}</p>
                        )}
                        {transaction.tipperName && (
                          <p className="text-sm text-muted-foreground">From: {transaction.tipperName}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold text-lg ${transaction.type === "earning" ? "text-green-600" : "text-red-600"}`}
                      >
                        {transaction.type === "earning" ? "+" : ""}₹{Math.abs(transaction.amount).toFixed(2)}
                      </p>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="earning">Earnings</SelectItem>
                <SelectItem value="withdrawal">Withdrawals</SelectItem>
                <SelectItem value="spending">Spending</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-time">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-time">All Time</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download size={16} className="mr-2" />
              Export
            </Button>
          </div>

          {/* Transactions List */}
          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-full bg-muted">{getTransactionIcon(transaction)}</div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{transaction.date}</span>
                          <span>•</span>
                          <span className="capitalize">{transaction.category.replace("_", " ")}</span>
                        </div>
                        {transaction.videoTitle && (
                          <p className="text-sm text-muted-foreground">Video: {transaction.videoTitle}</p>
                        )}
                        {transaction.tipperName && (
                          <p className="text-sm text-muted-foreground">From: {transaction.tipperName}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold text-lg ${transaction.type === "earning" ? "text-green-600" : "text-red-600"}`}
                      >
                        {transaction.type === "earning" ? "+" : ""}₹{Math.abs(transaction.amount).toFixed(2)}
                      </p>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdraw" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Withdraw Funds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="amount">Amount to withdraw</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>Available balance: ₹{balance.toFixed(2)}</span>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0"
                    onClick={() => setWithdrawAmount(balance.toString())}
                  >
                    Withdraw all
                  </Button>
                </div>
              </div>

              <div>
                <Label>Withdrawal method</Label>
                <div className="grid grid-cols-1 gap-4 mt-2">
                  {mockPaymentMethods.map((method) => (
                    <Card
                      key={method.id}
                      className={`cursor-pointer transition-colors ${
                        selectedPaymentMethod === method.id.toString()
                          ? "border-primary bg-primary/5"
                          : "hover:bg-accent"
                      }`}
                      onClick={() => setSelectedPaymentMethod(method.id.toString())}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                              {method.type === "bank" && <CreditCard size={20} />}
                              {method.type === "upi" && <Repeat size={20} />}
                              {method.type === "wallet" && <Wallet size={20} />}
                            </div>
                            <div>
                              <p className="font-medium">{method.name}</p>
                              <p className="text-sm text-muted-foreground">{method.details}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {method.isDefault && <Badge variant="secondary">Default</Badge>}
                            {selectedPaymentMethod === method.id.toString() && (
                              <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-primary-foreground text-xs">✓</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Withdrawal Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span>₹{withdrawAmount || "0.00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing fee:</span>
                    <span>₹{withdrawAmount ? (Number(withdrawAmount) * 0.02).toFixed(2) : "0.00"}</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-1">
                    <span>You'll receive:</span>
                    <span>₹{withdrawAmount ? (Number(withdrawAmount) * 0.98).toFixed(2) : "0.00"}</span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                disabled={!withdrawAmount || Number(withdrawAmount) > balance || Number(withdrawAmount) <= 0}
              >
                Withdraw ₹{withdrawAmount || "0.00"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earnings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Earnings Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Revenue Sources</h4>
                  <div className="space-y-3">
                    {mockEarningsSources.map((source, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-3 h-3 rounded-full bg-primary"
                            style={{ backgroundColor: `hsl(${index * 90}, 70%, 50%)` }}
                          />
                          <span className="text-sm">{source.source}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{source.amount.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">{source.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Performance Metrics</h4>
                  <div className="space-y-4">
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Average per video</span>
                        <span className="font-medium">₹12.50</span>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Best performing video</span>
                        <span className="font-medium">₹45.00</span>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Monthly growth</span>
                        <span className="font-medium text-green-600">+12%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Earning Videos */}
          <Card>
            <CardHeader>
              <CardTitle>Top Earning Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "How to Build a Startup", earnings: 45.0, views: 2500 },
                  { title: "React Advanced Patterns", earnings: 38.5, views: 1800 },
                  { title: "JavaScript Tips & Tricks", earnings: 32.0, views: 1600 },
                  { title: "Web Development Roadmap", earnings: 28.5, views: 1400 },
                ].map((video, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                        <span className="text-xs font-bold">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{video.title}</p>
                        <p className="text-sm text-muted-foreground">{video.views.toLocaleString()} views</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">₹{video.earnings.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">Total earned</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Payment Methods</h2>
            <Button>
              <Plus size={16} className="mr-2" />
              Add Method
            </Button>
          </div>

          <div className="space-y-4">
            {mockPaymentMethods.map((method) => (
              <Card key={method.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        {method.type === "bank" && <CreditCard size={24} />}
                        {method.type === "upi" && <Repeat size={24} />}
                        {method.type === "wallet" && <Wallet size={24} />}
                      </div>
                      <div>
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-muted-foreground">{method.details}</p>
                        {method.type === "bank" && <p className="text-xs text-muted-foreground">2-3 business days</p>}
                        {method.type === "upi" && <p className="text-xs text-muted-foreground">Instant transfer</p>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {method.isDefault && <Badge>Default</Badge>}
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add Payment Method Form */}
          <Card>
            <CardHeader>
              <CardTitle>Add New Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Payment Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Bank Account</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="wallet">Digital Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="account-name">Account Holder Name</Label>
                  <Input id="account-name" placeholder="Full name" />
                </div>
                <div>
                  <Label htmlFor="account-number">Account Number</Label>
                  <Input id="account-number" placeholder="Account number" />
                </div>
              </div>
              <Button className="w-full">Add Payment Method</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    { /* Mobile version */ }
    </div>
    {/* mobile version */}
<div className="block md:hidden bg-black text-white h-screen flex flex-col">
  {/*Top Section */}
  <div className="sticky top-0 z-20 bg-black px-4 pt-4 pb-2 space-y-4">
    {/* Header */}
    <div className="relative flex items-center justify-center font-poppins">
      <div className="mr-auto">
        <button onClick={() => router.back()}>
          <ChevronLeft size={28} />
        </button>
      </div>
      <h1 className="text-xl absolute left-1/2 -translate-x-1/2 ">My Wallet</h1>
    </div>

    {/* Balance Card */}
    <Card className="bg-black/80 backdrop-blur-md border border-gray-500/30 rounded-xl shadow">
      <CardContent className="pt-4">
        <p className="text-sm text-gray-400">Available Balance</p>
        <div className="flex items-center justify-between mt-1">
          <h3 className="text-2xl font-bold text-white">
            {showBalance ? `₹${balance.toFixed(2)}` : "₹****"}
          </h3>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-1 h-6 text-white hover:text-gray-300 active:scale-95 transition-transform"
          >
            {showBalance ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Pending: ₹{pendingBalance.toFixed(2)}
        </p>
      </CardContent>
    </Card>

    {/* Tabs */}
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-2 w-full bg-[#1f2937] rounded-xl overflow-hidden h-12 p-1 shadow-inner mt-2">
        <TabsTrigger
          value="overview"
          className="h-full w-full flex items-center justify-center font-semibold text-sm text-white rounded-lg data-[state=active]:bg-white data-[state=active]:text-black transition-all"
        >
          Overview
        </TabsTrigger>
        <TabsTrigger
          value="transactions"
          className="h-full w-full flex items-center justify-center font-semibold text-sm text-white rounded-lg data-[state=active]:bg-white data-[state=active]:text-black transition-all"
        >
          Transactions
        </TabsTrigger>
      </TabsList>
    </Tabs>
  </div>


{/* Scrollable Content */}
<div className="flex-1 overflow-y-auto px-4 pb-32 space-y-6 no-scrollbar">
  {activeTab === "overview" && (
  <div className="space-y-4 mt-3">
    {mockTransactions
      .filter(
        (transaction) =>
          transaction.category === "wallet_to_bank" || transaction.category === "bank_to_wallet"
      )
      .map((transaction) => (
        <div
          key={transaction.id}
          className="bg-[#1E1E1E] text-white rounded-xl px-4 py-3 shadow-md border border-gray-700/40"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-base font-semibold mb-4">{transaction.description}</p>
              <p className="text-xs text-gray-400">{transaction.date}</p>
            </div>
            <div className="text-right">
              <p
                className={`text-sm font-bold ${
                  transaction.amount > 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {transaction.amount > 0 ? "+" : "-"}₹{Math.abs(transaction.amount).toFixed(2)}
              </p>
              <div className="text-[10px] mt-2 pt-6">{getStatusBadge(transaction.status)}</div>
            </div>
          </div>
        </div>
      ))}
  </div>
)}

{activeTab === "transactions" && (
  <div className="space-y-4 mt-3">
    {mockTransactions
      .filter((transaction) => transaction.category === "wallet_to_app")
      .map((transaction) => (
        <div
          key={transaction.id}
          className="bg-[#1E1E1E] text-white rounded-xl px-4 py-3 shadow-md border border-gray-700/40"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-base font-semibold mb-4">{transaction.description}</p>
              <p className="text-xs text-gray-400">{transaction.date}</p>
            </div>
            <div className="text-right">
              <p
                className={`text-sm font-bold ${
                  transaction.amount > 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {transaction.amount > 0 ? "+" : "-"}₹{Math.abs(transaction.amount).toFixed(2)}
              </p>
              <div className="text-[10px] mt-2 pt-6">{getStatusBadge(transaction.status)}</div>
            </div>
          </div>
        </div>
      ))}
  </div>
)}

</div>


{/* Bottom Buttons for Both Tabs */}
<div className="fixed bottom-20 -mb-0.5 left-0 right-0 px-4 z-50 bg-black py-0.2 shadow-[0_-2px_10px_rgba(0,0,0,0.5)]">
  <div className="flex flex-col gap-3">
    <Button
      className="w-full text-black font-medium h-11 rounded-xl"
      style={{ backgroundColor: "#F1C40F" }}
    >
      Add credit
    </Button>
    <Button
      className="w-full text-black font-medium h-11 rounded-xl"
      style={{ backgroundColor: "#F1C40F" }}
    >
      Withdraw now
    </Button>
  </div>
</div>



</div>

    </>
  )
}
  
