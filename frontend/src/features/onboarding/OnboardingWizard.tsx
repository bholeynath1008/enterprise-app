import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Check, Upload, X, ChevronRight, ChevronLeft, Save } from 'lucide-react';
import { Button, Input, Select, ProgressBar } from '@/components/atoms';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/molecules';
import { cn } from '@/lib/utils';

// ---- Zod schemas per step ----
const step1Schema = z.object({
  businessName: z.string().min(2, 'Business name required'),
  ownerName: z.string().min(2, 'Owner name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),
  address: z.string().min(5, 'Address required'),
  city: z.string().min(2, 'City required'),
  state: z.string().min(2, 'State required'),
  planType: z.enum(['Standard', 'Premium', 'Enterprise']),
  estimatedLocations: z.coerce.number().min(1).max(50),
});

const step3Schema = z.object({
  agreeToTerms: z.boolean().refine(v => v === true, 'You must agree to the terms'),
  agreeToRoyalties: z.boolean().refine(v => v === true, 'You must agree to the royalty schedule'),
  agreeToBrandStandards: z.boolean().refine(v => v === true, 'You must agree to brand standards'),
  digitalSignature: z.string().min(2, 'Digital signature required'),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step3Data = z.infer<typeof step3Schema>;

interface UploadedFile { name: string; type: string; size: string; url: string }

const STEPS = [
  { id: 1, label: 'Business Info', description: 'Company and owner details' },
  { id: 2, label: 'Documents', description: 'Upload required files' },
  { id: 3, label: 'Agreement', description: 'Review and accept terms' },
  { id: 4, label: 'Review', description: 'Confirm and submit' },
];

const REQUIRED_DOCS = [
  { id: 'business_license', label: 'Business License', required: true },
  { id: 'tax_id', label: 'Tax ID / EIN Document', required: true },
  { id: 'proof_of_funds', label: 'Proof of Funds', required: true },
  { id: 'personal_id', label: 'Personal Identification', required: true },
  { id: 'lease_agreement', label: 'Location Lease Agreement', required: false },
];

export default function OnboardingWizard() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, UploadedFile>>({});
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [step1Data, setStep1Data] = useState<Partial<Step1Data>>({});
  const [isDraft, setIsDraft] = useState(false);

  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: { planType: 'Standard', estimatedLocations: 1, ...step1Data },
  });

  const step3Form = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: { agreeToTerms: false, agreeToRoyalties: false, agreeToBrandStandards: false, digitalSignature: '' },
  });

  const simulateUpload = useCallback((docId: string, fileName: string) => {
    setUploading(docId);
    setUploadProgress(0);
    const iv = setInterval(() => {
      setUploadProgress(p => {
        const next = p + Math.random() * 30;
        if (next >= 100) {
          clearInterval(iv);
          setUploading(null);
          setUploadProgress(0);
          setUploadedDocs(prev => ({
            ...prev,
            [docId]: { name: fileName, type: 'application/pdf', size: `${(Math.random() * 4 + 0.5).toFixed(1)} MB`, url: `https://mock-storage.fms.dev/${docId}_${Date.now()}.pdf` },
          }));
          toast.success(`${fileName} uploaded successfully!`);
          return 100;
        }
        return next;
      });
    }, 200);
  }, []);

  const handleFileInput = (docId: string) => {
    simulateUpload(docId, `${docId}_document.pdf`);
  };

  const removeDoc = (docId: string) => {
    setUploadedDocs(prev => { const n = { ...prev }; delete n[docId]; return n; });
  };

  const canProceedStep2 = REQUIRED_DOCS.filter(d => d.required).every(d => uploadedDocs[d.id]);

  const handleStep1Next = step1Form.handleSubmit(data => {
    setStep1Data(data);
    setCurrentStep(2);
  });

  const handleStep3Next = step3Form.handleSubmit(() => setCurrentStep(4));

  const handleSubmit = () => {
    toast.success('Onboarding application submitted! HQ will review within 3-5 business days.');
    setCurrentStep(1);
    step1Form.reset();
    step3Form.reset();
    setUploadedDocs({});
  };

  const saveDraft = () => {
    setIsDraft(true);
    toast.success('Draft saved! You can return to complete it later.');
  };

  const progressPct = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">{t('onboarding.title')}</h2>
        <p className="text-sm text-muted-foreground mt-1">Complete all steps to submit your franchise application.</p>
      </div>

      {/* Stepper */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          {STEPS.map((step, i) => {
            const done = currentStep > step.id;
            const active = currentStep === step.id;
            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <div className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all',
                    done ? 'bg-emerald-500 border-emerald-500 text-white'
                      : active ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-muted border-border text-muted-foreground'
                  )}>
                    {done ? <Check size={16} /> : step.id}
                  </div>
                  <div className="text-center hidden sm:block">
                    <p className={cn('text-xs font-semibold', active ? 'text-foreground' : 'text-muted-foreground')}>{step.label}</p>
                    <p className="text-[10px] text-muted-foreground hidden md:block">{step.description}</p>
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={cn('flex-1 h-0.5 mx-2 mb-7 rounded-full transition-all', currentStep > step.id ? 'bg-emerald-500' : 'bg-border')} />
                )}
              </React.Fragment>
            );
          })}
        </div>
        <ProgressBar value={progressPct} color="blue" />
      </div>

      {/* Step 1: Business Info */}
      {currentStep === 1 && (
        <Card>
          <CardHeader><CardTitle>Step 1 — Business Information</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleStep1Next} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Business Name" placeholder="e.g. My Franchise LLC" error={step1Form.formState.errors.businessName?.message} {...step1Form.register('businessName')} />
                <Input label="Owner Full Name" placeholder="John Smith" error={step1Form.formState.errors.ownerName?.message} {...step1Form.register('ownerName')} />
                <Input label="Email Address" type="email" placeholder="owner@business.com" error={step1Form.formState.errors.email?.message} {...step1Form.register('email')} />
                <Input label="Phone Number" placeholder="(555) 000-0000" error={step1Form.formState.errors.phone?.message} {...step1Form.register('phone')} />
              </div>
              <Input label="Business Address" placeholder="123 Main Street" error={step1Form.formState.errors.address?.message} {...step1Form.register('address')} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="City" placeholder="New York" error={step1Form.formState.errors.city?.message} {...step1Form.register('city')} />
                <Input label="State" placeholder="NY" error={step1Form.formState.errors.state?.message} {...step1Form.register('state')} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Plan Type"
                  options={[{ value: 'Standard', label: 'Standard (6% royalty)' }, { value: 'Premium', label: 'Premium (5.5% royalty)' }, { value: 'Enterprise', label: 'Enterprise (5% royalty)' }]}
                  error={step1Form.formState.errors.planType?.message}
                  {...step1Form.register('planType')}
                />
                <Input label="Estimated Locations" type="number" min={1} max={50} error={step1Form.formState.errors.estimatedLocations?.message} {...step1Form.register('estimatedLocations')} />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="ghost" size="md" onClick={saveDraft} leftIcon={<Save size={14} />}>
                  {t('onboarding.saveDraft')}
                </Button>
                <Button type="submit" variant="primary" size="md" rightIcon={<ChevronRight size={14} />} className="ml-auto">
                  {t('onboarding.next')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Document Upload */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2 — Document Upload</CardTitle>
            <span className="text-xs text-muted-foreground">{Object.keys(uploadedDocs).length}/{REQUIRED_DOCS.filter(d => d.required).length} required uploaded</span>
          </CardHeader>
          <CardContent className="space-y-3">
            {REQUIRED_DOCS.map(doc => {
              const uploaded = uploadedDocs[doc.id];
              const isUploading = uploading === doc.id;
              return (
                <div key={doc.id} className={cn('flex items-center gap-3 p-3 rounded-lg border transition-all', uploaded ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-border bg-muted/30')}>
                  <div className={cn('w-8 h-8 rounded flex items-center justify-center flex-shrink-0', uploaded ? 'bg-emerald-500/20 text-emerald-400' : 'bg-muted text-muted-foreground')}>
                    {uploaded ? <Check size={16} /> : '📄'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{doc.label}</p>
                      {doc.required && <span className="text-[10px] text-red-400 font-semibold">Required</span>}
                    </div>
                    {uploaded && <p className="text-xs text-muted-foreground">{uploaded.name} · {uploaded.size}</p>}
                    {isUploading && (
                      <div className="mt-1.5">
                        <ProgressBar value={uploadProgress} color="blue" />
                        <p className="text-xs text-blue-400 mt-0.5">Uploading... {Math.round(uploadProgress)}%</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {uploaded ? (
                      <button onClick={() => removeDoc(doc.id)} className="p-1 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors" aria-label={`Remove ${doc.label}`}>
                        <X size={14} />
                      </button>
                    ) : (
                      <Button type="button" variant="ghost" size="sm" onClick={() => handleFileInput(doc.id)} disabled={isUploading} leftIcon={<Upload size={12} />}>
                        {isUploading ? 'Uploading...' : 'Upload'}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
            {!canProceedStep2 && (
              <p className="text-xs text-amber-400 flex items-center gap-1.5 mt-2">
                ⚠ Please upload all required documents before proceeding.
              </p>
            )}
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="ghost" size="md" onClick={() => setCurrentStep(1)} leftIcon={<ChevronLeft size={14} />}>
                {t('onboarding.prev')}
              </Button>
              <Button type="button" variant="ghost" size="md" onClick={saveDraft} leftIcon={<Save size={14} />}>
                {t('onboarding.saveDraft')}
              </Button>
              <Button type="button" variant="primary" size="md" onClick={() => setCurrentStep(3)} disabled={!canProceedStep2} rightIcon={<ChevronRight size={14} />} className="ml-auto">
                {t('onboarding.next')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Agreement */}
      {currentStep === 3 && (
        <Card>
          <CardHeader><CardTitle>Step 3 — Franchise Agreement</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleStep3Next} className="space-y-4" noValidate>
              <div className="p-4 rounded-lg bg-muted/50 border border-border text-sm text-muted-foreground leading-relaxed max-h-40 overflow-y-auto">
                <p className="font-semibold text-foreground mb-2">Franchise Agreement Summary</p>
                <p>This Franchise Agreement ("Agreement") is entered into between FMS Holdings Inc. ("Franchisor") and the applicant ("Franchisee"). The Franchisee agrees to operate the franchise location in compliance with the Operations Manual, Brand Standards Guide, and all applicable laws. Royalties are due quarterly per the agreed rate in your plan. Non-compliance may result in suspension or termination per Section 12.4. This is a binding legal agreement — consult with legal counsel before signing.</p>
              </div>

              {[
                { key: 'agreeToTerms' as const, label: 'I have read and agree to the Franchise Agreement terms and conditions.' },
                { key: 'agreeToRoyalties' as const, label: 'I agree to the royalty payment schedule and understand the consequences of non-payment.' },
                { key: 'agreeToBrandStandards' as const, label: 'I agree to maintain all brand standards and comply with the Operations Manual.' },
              ].map(({ key, label }) => {
                const field = step3Form.register(key);
                const error = step3Form.formState.errors[key];
                return (
                  <div key={key}>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input type="checkbox" {...field} className="mt-0.5 w-4 h-4 rounded border-border text-blue-500 cursor-pointer" />
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
                    </label>
                    {error && <p className="text-xs text-red-400 mt-1 ml-7">⚠ {error.message}</p>}
                  </div>
                );
              })}

              <Input
                label="Digital Signature (type your full legal name)"
                placeholder="John Smith"
                error={step3Form.formState.errors.digitalSignature?.message}
                {...step3Form.register('digitalSignature')}
              />

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="ghost" size="md" onClick={() => setCurrentStep(2)} leftIcon={<ChevronLeft size={14} />}>
                  {t('onboarding.prev')}
                </Button>
                <Button type="submit" variant="primary" size="md" rightIcon={<ChevronRight size={14} />} className="ml-auto">
                  {t('onboarding.next')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Review */}
      {currentStep === 4 && (
        <Card>
          <CardHeader><CardTitle>Step 4 — Review & Submit</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
              <p className="text-sm font-semibold text-emerald-400 mb-1">✓ All steps complete</p>
              <p className="text-xs text-muted-foreground">Your application is ready to submit. Review the summary below before submitting.</p>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg border border-border bg-muted/30">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Business Information</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <p className="text-muted-foreground">Business Name</p><p className="text-foreground font-medium">{step1Data.businessName ?? '—'}</p>
                  <p className="text-muted-foreground">Owner</p><p className="text-foreground font-medium">{step1Data.ownerName ?? '—'}</p>
                  <p className="text-muted-foreground">Plan</p><p className="text-foreground font-medium">{step1Data.planType ?? '—'}</p>
                  <p className="text-muted-foreground">Locations</p><p className="text-foreground font-medium">{step1Data.estimatedLocations ?? '—'}</p>
                </div>
              </div>
              <div className="p-3 rounded-lg border border-border bg-muted/30">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Documents ({Object.keys(uploadedDocs).length} uploaded)</p>
                {Object.values(uploadedDocs).map(d => (
                  <p key={d.url} className="text-sm text-emerald-400 flex items-center gap-1.5"><Check size={12} /> {d.name}</p>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="ghost" size="md" onClick={() => setCurrentStep(3)} leftIcon={<ChevronLeft size={14} />}>
                {t('onboarding.prev')}
              </Button>
              <Button type="button" variant="success" size="md" onClick={handleSubmit} className="ml-auto">
                {t('onboarding.submit')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
