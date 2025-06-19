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
import { User, Bell, Shield, Globe, Volume2, Lock, AlertTriangle } from 'lucide-react';
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
              
              {/* Account Type - Show as locked */}
              <div>
                <Label htmlFor="userType">Account Type</Label>
                <div className="flex items-center gap-3 mt-1">
                  <Input 
                    id="userType" 
                    value={profile?.user_type ? `${profile.user_type.charAt(0).toUpperCase()}${profile.user_type.slice(1)}` : 'Not set'} 
                    disabled 
                    className="flex-1"
                  />
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Lock className="w-3 h-3" />
                    <span>Locked</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Account type cannot be changed. Create a new account to switch roles.
                </p>
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

          {/* Account Type Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Account Type Policy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg dark:bg-amber-900/20 dark:border-amber-800">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="font-medium text-amber-800 dark:text-amber-200">
                      Your account type is permanently set as: <span className="capitalize font-bold">{profile?.user_type || 'Not set'}</span>
                    </h4>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      For security and data integrity reasons, account types cannot be changed once selected. 
                      This ensures that patient data remains separate from professional accounts and maintains 
                      proper access controls.
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      If you need to switch between patient and professional roles, you'll need to create 
                      a separate account with a different email address.
                    </p>
                  </div>
                </div>
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