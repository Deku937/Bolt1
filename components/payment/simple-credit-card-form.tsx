'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Lock, CreditCard, Shield, Calendar, User, MapPin } from 'lucide-react';

interface BookingDetails {
  professional: {
    id: string;
    name: string;
    price: number;
  };
  slot: string;
  type: string;
  duration: number;
  paymentMethod: 'tokens' | 'stripe';
}

interface SimpleCreditCardFormProps {
  bookingDetails: BookingDetails;
  onFinalize: () => void;
  onCancel: () => void;
}

export function SimpleCreditCardForm({ bookingDetails, onFinalize, onCancel }: SimpleCreditCardFormProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Format expiry date MM/YY
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  // Format CVV (3-4 digits)
  const formatCvv = (value: string) => {
    return value.replace(/\D/g, '').substring(0, 4);
  };

  // Format postal code
  const formatPostalCode = (value: string) => {
    return value.replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 10);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiryDate(formatted);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCvv(e.target.value);
    setCvv(formatted);
  };

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPostalCode(e.target.value);
    setPostalCode(formatted);
  };

  const calculatePrice = () => {
    const basePrice = bookingDetails.professional.price;
    const typeMultiplier = bookingDetails.type === 'audio' ? 0.85 : bookingDetails.type === 'chat' ? 0.7 : 1.0;
    const durationMultiplier = bookingDetails.duration === 75 ? 1.5 : bookingDetails.duration === 30 ? 0.6 : 1.0;
    return (basePrice * typeMultiplier * durationMultiplier).toFixed(2);
  };

  const handleFinalize = async () => {
    setIsProcessing(true);
    
    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false);
      onFinalize();
    }, 2000);
  };

  const isFormValid = cardNumber.length >= 15 && expiryDate.length === 5 && cvv.length >= 3 && cardholderName.trim() && postalCode.trim();

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={onCancel}
          className="flex items-center gap-2 hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Booking
        </Button>
      </div>

      {/* Booking Summary */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <h2 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Complete Your Payment
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <p className="text-blue-700">
              <span className="font-medium">Professional:</span> {bookingDetails.professional.name}
            </p>
            <p className="text-blue-700">
              <span className="font-medium">Session:</span> {bookingDetails.duration}-minute {bookingDetails.type}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-blue-700">
              <span className="font-medium">Time:</span> {bookingDetails.slot}
            </p>
            <p className="text-blue-700">
              <span className="font-medium">Total:</span> <span className="text-xl font-bold">${calculatePrice()}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Credit Card Form */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-primary to-healing text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3">
            <CreditCard className="w-6 h-6" />
            Payment Information
          </CardTitle>
          <p className="text-blue-100 text-sm">Enter your payment details securely</p>
        </CardHeader>
        
        <CardContent className="p-8">
          <form className="space-y-6">
            {/* Cardholder Name */}
            <div className="space-y-2">
              <Label htmlFor="cardholderName" className="text-sm font-semibold flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Cardholder Name
              </Label>
              <Input
                id="cardholderName"
                type="text"
                placeholder="John Doe"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                className="h-12 text-base border-2 focus:border-primary transition-colors"
              />
            </div>

            {/* Card Number */}
            <div className="space-y-2">
              <Label htmlFor="cardNumber" className="text-sm font-semibold flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />
                Card Number
              </Label>
              <Input
                id="cardNumber"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={handleCardNumberChange}
                maxLength={19}
                className="h-12 text-base font-mono tracking-wider border-2 focus:border-primary transition-colors"
              />
            </div>

            {/* Expiry Date and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate" className="text-sm font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Expiry Date
                </Label>
                <Input
                  id="expiryDate"
                  type="text"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={handleExpiryChange}
                  maxLength={5}
                  className="h-12 text-base font-mono border-2 focus:border-primary transition-colors"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cvv" className="text-sm font-semibold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  CVV
                </Label>
                <Input
                  id="cvv"
                  type="text"
                  placeholder="123"
                  value={cvv}
                  onChange={handleCvvChange}
                  maxLength={4}
                  className="h-12 text-base font-mono border-2 focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Postal Code */}
            <div className="space-y-2">
              <Label htmlFor="postalCode" className="text-sm font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Postal Code
              </Label>
              <Input
                id="postalCode"
                type="text"
                placeholder="12345"
                value={postalCode}
                onChange={handlePostalCodeChange}
                className="h-12 text-base border-2 focus:border-primary transition-colors"
              />
            </div>

            {/* Security Notice */}
            <div className="flex items-start gap-3 text-sm text-muted-foreground bg-green-50 p-4 rounded-lg border border-green-200">
              <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-green-800 mb-1">🔒 Your payment is secure</p>
                <p className="text-green-700">Your payment information is encrypted with 256-bit SSL and processed securely. We never store your card details.</p>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Session Fee</span>
                <span className="font-medium">${calculatePrice()}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Processing Fee</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Amount</span>
                  <span className="text-xl font-bold text-primary">${calculatePrice()}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isProcessing}
                className="flex-1 h-12"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleFinalize}
                disabled={!isFormValid || isProcessing}
                className="flex-1 h-12 bg-gradient-to-r from-primary to-healing hover:from-primary/90 hover:to-healing/90 text-white font-semibold"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Finalize Payment ${calculatePrice()}
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Additional Security Info */}
      <div className="mt-6 text-center">
        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            <span>SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span>Secure Processing</span>
          </div>
          <div className="flex items-center gap-1">
            <CreditCard className="w-3 h-3" />
            <span>PCI Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}