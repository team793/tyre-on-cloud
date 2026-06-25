'use client';

import { useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Drawer } from 'vaul';
import { ArrowRight, Car, Loader2, Ruler, ScanLine, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTyreFinder, type UseTyreFinderReturn, type FinderTabId } from '@/hooks/useTyreFinder';
import { useProducts } from '@/hooks/useProducts';
import { useLanguage } from '@/context/LanguageContext';
import { WIDTHS, type ResolvedFitment } from '@/lib/tyreFinder/fitmentData';

export function TyreFinder() {
  const finder = useTyreFinder();
  const router = useRouter();
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSearch = (fitment: ResolvedFitment) => {
    const params = new URLSearchParams({
      mode: 'customer',
      width: String(fitment.width),
      profile: String(fitment.profile),
      rimSize: String(fitment.rimSize),
    });
    router.push(`/shop?${params.toString()}`);
    setMobileOpen(false);
  };

  const mobileTriggerLabel = finder.resolvedFitment
    ? `${finder.resolvedFitment.width}/${finder.resolvedFitment.profile} R${finder.resolvedFitment.rimSize}`
    : t.finder.sub;

  return (
    <>
      {/* Desktop / tablet — inline card */}
      <div className="hidden rounded-2xl border border-ink-700 bg-ink-900/80 p-6 backdrop-blur sm:p-8 md:block">
        <FinderPanel finder={finder} onSearch={handleSearch} />
      </div>

      {/* Mobile — bottom-sheet drawer */}
      <div className="md:hidden">
        <Drawer.Root open={mobileOpen} onOpenChange={setMobileOpen} shouldScaleBackground>
          <Drawer.Trigger asChild>
            <button className="flex w-full items-center gap-3 rounded-full border border-ink-700 bg-ink-900 px-5 py-3.5 text-left font-body text-sm text-chalk-100 transition active:scale-[0.99]">
              <Search size={16} className="shrink-0 text-brand-400" />
              <span className="truncate">{mobileTriggerLabel}</span>
            </button>
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 z-40 bg-black/60" />
            <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 flex max-h-[88vh] flex-col rounded-t-2xl bg-ink-950">
              <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-ink-700" />
              <div className="overflow-y-auto px-5 pb-8 pt-4">
                <FinderPanel finder={finder} onSearch={handleSearch} />
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
    </>
  );
}

interface FinderPanelProps {
  finder: UseTyreFinderReturn;
  onSearch: (fitment: ResolvedFitment) => void;
}

function FinderPanel({ finder, onSearch }: FinderPanelProps) {
  const { activeTab, setActiveTab } = finder;
  const { t } = useLanguage();

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as FinderTabId)}>
      <TabsList className="mb-6">
        <FinderTab value="size"    icon={Ruler}    label={t.finder.bySize}    activeTab={activeTab} />
        <FinderTab value="vehicle" icon={Car}      label={t.finder.byVehicle} activeTab={activeTab} />
        <FinderTab value="plate"   icon={ScanLine} label={t.finder.byPlate}   activeTab={activeTab} />
      </TabsList>

      <TabsContent value="size">    <SizeTab    finder={finder} /></TabsContent>
      <TabsContent value="vehicle"> <VehicleTab finder={finder} /></TabsContent>
      <TabsContent value="plate">   <PlateTab   finder={finder} /></TabsContent>

      <MatchCounterButton fitment={finder.resolvedFitment} onSearch={onSearch} />
    </Tabs>
  );
}

function FinderTab({
  value, icon: Icon, label, activeTab,
}: {
  value: FinderTabId; icon: typeof Ruler; label: string; activeTab: FinderTabId;
}) {
  return (
    <TabsTrigger value={value}>
      <Icon size={14} />
      {label}
      {activeTab === value && (
        <motion.span
          layoutId="finder-tab-underline"
          className="absolute inset-x-0 -bottom-px h-[2px] bg-brand-500"
          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
        />
      )}
    </TabsTrigger>
  );
}

function FinderField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-steel-400">{label}</p>
      {children}
    </div>
  );
}

function SizeTab({ finder }: { finder: UseTyreFinderReturn }) {
  const { size, setWidth, setProfile, setRimSize, availableProfiles, availableRims } = finder;
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <FinderField label={t.finder.width}>
        <Select value={size.width ? String(size.width) : ''} onValueChange={(v) => setWidth(Number(v))}>
          <SelectTrigger><SelectValue placeholder={t.finder.selectWidth} /></SelectTrigger>
          <SelectContent>
            {WIDTHS.map((w) => (
              <SelectItem key={w} value={String(w)}>{w} mm</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FinderField>

      <FinderField label={t.finder.profile}>
        <Select
          value={size.profile ? String(size.profile) : ''}
          onValueChange={(v) => setProfile(Number(v))}
          disabled={!size.width}
        >
          <SelectTrigger>
            <SelectValue placeholder={size.width ? t.finder.selectProfile : t.finder.selectWidthFirst} />
          </SelectTrigger>
          <SelectContent>
            {availableProfiles.map((p) => (
              <SelectItem key={p} value={String(p)}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FinderField>

      <FinderField label={t.finder.rimSize}>
        <Select
          value={size.rimSize ? String(size.rimSize) : ''}
          onValueChange={(v) => setRimSize(Number(v))}
          disabled={!size.profile}
        >
          <SelectTrigger>
            <SelectValue placeholder={size.profile ? t.finder.selectRim : t.finder.selectProfileFirst} />
          </SelectTrigger>
          <SelectContent>
            {availableRims.map((r) => (
              <SelectItem key={r} value={String(r)}>R{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FinderField>
    </div>
  );
}

function VehicleTab({ finder }: { finder: UseTyreFinderReturn }) {
  const { vehicle, setYear, setMake, setModel, setOption, availableYears, availableMakes, availableModels, availableOptions } = finder;
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <FinderField label={t.finder.year}>
        <Select value={vehicle.year ? String(vehicle.year) : ''} onValueChange={(v) => setYear(Number(v))}>
          <SelectTrigger><SelectValue placeholder={t.finder.selectYear} /></SelectTrigger>
          <SelectContent>
            {availableYears.map((y) => (
              <SelectItem key={y} value={String(y)}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FinderField>

      <FinderField label={t.finder.make}>
        <Select value={vehicle.make ?? ''} onValueChange={setMake} disabled={!vehicle.year}>
          <SelectTrigger>
            <SelectValue placeholder={vehicle.year ? t.finder.selectMake : t.finder.selectYearFirst} />
          </SelectTrigger>
          <SelectContent>
            {availableMakes.map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FinderField>

      <FinderField label={t.finder.model}>
        <Select value={vehicle.model ?? ''} onValueChange={setModel} disabled={!vehicle.make}>
          <SelectTrigger>
            <SelectValue placeholder={vehicle.make ? t.finder.selectModel : t.finder.selectMakeFirst} />
          </SelectTrigger>
          <SelectContent>
            {availableModels.map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FinderField>

      <FinderField label={t.finder.option}>
        <Select value={vehicle.option ?? ''} onValueChange={setOption} disabled={!vehicle.model}>
          <SelectTrigger>
            <SelectValue placeholder={vehicle.model ? t.finder.selectOption : t.finder.selectModelFirst} />
          </SelectTrigger>
          <SelectContent>
            {availableOptions.map((o) => (
              <SelectItem key={o} value={o}>{o}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FinderField>
    </div>
  );
}

function PlateTab({ finder }: { finder: UseTyreFinderReturn }) {
  const { plateValue, setPlateValue, plateStatus, plateResult, lookupPlate, resetPlate, setActiveTab } = finder;
  const { t } = useLanguage();

  return (
    <div>
      <FinderField label={t.finder.plateLabel}>
        <div className="flex gap-2">
          <input
            value={plateValue}
            onChange={(e) => {
              setPlateValue(e.target.value);
              if (plateStatus !== 'idle') resetPlate();
            }}
            onKeyDown={(e) => { if (e.key === 'Enter') lookupPlate(); }}
            placeholder={t.finder.platePlaceholder}
            className="h-11 flex-1 rounded-lg border border-ink-700 bg-ink-900 px-3.5 font-mono text-sm uppercase tracking-wider text-chalk-100 outline-none placeholder:tracking-normal placeholder:text-steel-400 focus-visible:ring-2 focus-visible:ring-brand-400"
          />
          <button
            onClick={lookupPlate}
            disabled={!plateValue.trim() || plateStatus === 'loading'}
            className="flex items-center gap-2 rounded-lg bg-brand-600 px-5 text-sm font-semibold text-white transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {plateStatus === 'loading' ? <Loader2 size={15} className="animate-spin" /> : t.finder.lookUp}
          </button>
        </div>
      </FinderField>

      <AnimatePresence mode="wait">
        {plateStatus === 'found' && plateResult && (
          <motion.div
            key="found"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-lg border border-ink-700 bg-ink-850 p-4"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-steel-400">
              {plateResult.make} {plateResult.model}
            </p>
            <p className="mt-1 font-display text-lg text-chalk-100">
              {plateResult.width}/{plateResult.profile} R{plateResult.rimSize}
            </p>
          </motion.div>
        )}

        {plateStatus === 'not-found' && (
          <motion.p
            key="not-found"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 font-body text-sm text-chalk-300"
          >
            {t.finder.notFound}{' '}
            <button
              onClick={() => setActiveTab('size')}
              className="font-semibold text-brand-400 underline-offset-2 hover:underline"
            >
              {t.finder.searchBySize}
            </button>{' '}
            {t.finder.instead}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function MatchCounterButton({ fitment, onSearch }: { fitment: ResolvedFitment | null; onSearch: (fitment: ResolvedFitment) => void }) {
  const { data, isFetching, isError, refetch } = useProducts(fitment ?? {}, { enabled: !!fitment });
  const { t } = useLanguage();
  const count = data?.products.length ?? 0;

  if (!fitment) {
    return (
      <button disabled className="mt-8 flex w-full items-center justify-center gap-2 rounded-full border border-ink-700 py-3.5 font-body text-sm font-semibold text-steel-400">
        {t.finder.selectSize}
      </button>
    );
  }

  if (isError) {
    return (
      <button
        onClick={() => refetch()}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-full border border-steel-600 py-3.5 font-body text-sm font-semibold text-chalk-100 transition hover:border-brand-400 hover:text-brand-400"
      >
        {t.finder.tryAgain}
      </button>
    );
  }

  return (
    <motion.button
      key={isFetching ? 'loading' : count}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      onClick={() => onSearch(fitment)}
      disabled={isFetching}
      className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 py-3.5 font-body text-sm font-semibold text-white transition hover:bg-brand-500 disabled:cursor-wait disabled:opacity-80"
    >
      {isFetching ? (
        <><Loader2 size={16} className="animate-spin" />{t.finder.searching}</>
      ) : (
        <>{t.finder.showTyres} {count} {t.finder.matching}<ArrowRight size={16} /></>
      )}
    </motion.button>
  );
}
