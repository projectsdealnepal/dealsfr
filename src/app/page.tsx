"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Zap, TrendingUp, Building2, User, Download } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Image
            src="/images/TheDealsFr.png"
            alt="TheDealsFr"
            width={120}
            height={40}
            className="h-8 md:h-10 w-auto"
          />

          {/* Nav */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-sm font-medium">
            <Link href="#features" className="hover:text-primary transition-colors">How It Works</Link>
            <Link href="#for-stores" className="hover:text-primary transition-colors">For Stores</Link>
            <Link href="#customers" className="hover:text-primary transition-colors">For Customers</Link>
            <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download App
            </Button>
            <Button size="sm">
              <Building2 className="w-4 h-4 mr-2" />
              Register Store
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24 lg:py-32 text-center">
        <div className="container mx-auto px-4">
          <Badge variant="secondary" className="mb-6">
            🎯 Connecting Local Communities
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Discover{" "}
            <span className="text-primary">Local Deals</span>, Effortlessly.
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10">
            TheDealsFr connects you with exclusive discounts from nearby stores. Save smarter, support local.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 mb-12">
            <Link href="/register/registerCustomer">
              <Button size="lg">
                <User className="w-5 h-5 mr-2" />
                Join as Customer
              </Button>
            </Link>
            <Link href="/register/registerStoreAdmin">
              <Button size="lg" variant="outline">
                <Building2 className="w-5 h-5 mr-2" />
                Register Store
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center space-x-2 border rounded-full px-4 py-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <MapPin className="w-4 h-4" />
              <span>HyperLocal</span>
            </div>
            <div className="flex items-center space-x-2 border rounded-full px-4 py-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Zap className="w-4 h-4" />
              <span>Exclusive Offers</span>
            </div>
            <div className="flex items-center space-x-2 border rounded-full px-4 py-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <TrendingUp className="w-4 h-4" />
              <span>Real-Time Updates</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-muted-foreground">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-muted-foreground">Partnered Stores</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">98%</div>
              <div className="text-muted-foreground">Deal Satisfaction</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
