'use client';

import { useAuth } from '@/providers/auth-provider';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AudioDescriptionToggle } from '@/components/ui/audio-description-toggle';
import { User, Bell, Shield, Globe, Volume2 } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const { user, profile } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false
  });

  return (
    <DashboardLayout userType={profile?.user_type || 'patient'}>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and accessibility settings</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue={profile?.first_name || ''} />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue={profile?.last_name || ''} />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user?.email || ''} />
              </div>
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="UTC-5">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                    <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                    <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                    <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          {/* Audio Description Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                Audio Descriptions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Audio Description Settings</Label>
                  <p className="text-sm text-muted-foreground">Configure spoken descriptions for better accessibility</p>
                </div>
                <div className="flex items-center gap-2">
                  <AudioDescriptionToggle />
                </div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Features:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Spoken descriptions of UI elements</li>
                  <li>• Page content narration</li>
                  <li>• Navigation assistance</li>
                  <li>• Customizable voice and speed</li>
                  <li>• Keyboard navigation support</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Browser notifications</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={notifications.push}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Text message alerts</p>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={notifications.sms}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
              <Button variant="outline" className="w-full">
                Two-Factor Authentication
              </Button>
              <Button variant="outline" className="w-full">
                Download My Data
              </Button>
              <Button variant="destructive" className="w-full">
                Delete Account
              </Button>
            </CardContent>
          </Card>

          {/* Language & Region */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Language & Region
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="region">Region</Label>
                <Select defaultValue="us">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Accessibility Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Accessibility Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Keyboard Navigation</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Tab: Navigate between elements</li>
                    <li>• Enter/Space: Activate buttons</li>
                    <li>• Arrow keys: Navigate menus</li>
                    <li>• Esc: Close dialogs</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Audio Descriptions</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Hover over elements for descriptions</li>
                    <li>• Focus elements to hear their purpose</li>
                    <li>• Use settings to customize voice</li>
                    <li>• Enable auto-describe for full narration</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}