import Link from 'next/link';
import { Heart, Shield, Globe, Users } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-healing rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-healing bg-clip-text text-transparent">
                MindWell
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Supporting your mental health journey with compassion, expertise, and innovation.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Platform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="/professionals" className="hover:text-primary transition-colors">Find Professionals</Link></li>
              <li><Link href="/resources" className="hover:text-primary transition-colors">Resources</Link></li>
              <li><Link href="/community" className="hover:text-primary transition-colors">Community</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/crisis" className="hover:text-primary transition-colors">Crisis Support</Link></li>
              <li><Link href="/safety" className="hover:text-primary transition-colors">Safety</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/compliance" className="hover:text-primary transition-colors">HIPAA Compliance</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>Available Worldwide</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Licensed Professionals</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 MindWell. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}