import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

const accountTypes = [
  "Valorant",
  "CSGO",
  "Steam",
  "Fortnite",
  "League of Legends",
  "Dota 2",
  "PUBG",
  "Apex Legends",
  "Overwatch",
  "Rainbow Six Siege",
  "Genshin Impact",
  "Roblox",
  "Minecraft",
  "Call of Duty",
  "Rocket League",
  "Other",
] as const;

const gameCurrencies: Record<string, { code: string; label: string }[]> = {
  Valorant: [
    { code: "VP", label: "Valorant Points (VP)" },
    { code: "RAD", label: "Radianite Points (RAD)" },
  ],
  CSGO: [
    { code: "USD", label: "USD" },
    { code: "EUR", label: "EUR" },
  ],
  Steam: [
    { code: "USD", label: "USD" },
    { code: "EUR", label: "EUR" },
  ],
  "League of Legends": [{ code: "RP", label: "Riot Points (RP)" }],
  "Dota 2": [{ code: "USD", label: "USD" }],
  Fortnite: [{ code: "VB", label: "V-Bucks (VB)" }],
  PUBG: [{ code: "UC", label: "Unknown Cash (UC)" }],
  "Apex Legends": [{ code: "AC", label: "Apex Coins (AC)" }],
  Overwatch: [{ code: "CR", label: "Credits (CR)" }],
  "Rainbow Six Siege": [{ code: "R6C", label: "R6 Credits (R6C)" }],
  "Genshin Impact": [{ code: "PG", label: "Primogems (PG)" }],
  Roblox: [{ code: "R$", label: "Robux (R$)" }],
  Minecraft: [{ code: "MCC", label: "Minecoins (MCC)" }],
  "Call of Duty": [{ code: "CP", label: "CoD Points (CP)" }],
  "Rocket League": [{ code: "CR", label: "Credits (CR)" }],
  Other: [{ code: "USD", label: "USD" }],
};

const priceCurrencies = [
  "PKR",
  "USD",
  "EUR",
  "GBP",
  "AED",
  "INR",
  "SAR",
  "CNY",
  "JPY",
  "AUD",
  "CAD",
  "TRY",
  "RUB",
  "KWD",
  "QAR",
  "BHD",
  "MYR",
] as const;

const schema = z.object({
  region: z.string().min(1, "Region is required"),
  accountType: z.enum(accountTypes),
  accountName: z.string().min(2, "Enter a valid account name"),
  accountCurrency: z.string().min(1, "Select account currency"),
  currencySpent: z.coerce.number().min(0, "Must be a positive number"),
  sellingPriceCurrency: z.enum(priceCurrencies),
  sellingPrice: z.coerce.number().min(0, "Must be a positive number"),
  accountLevel: z.string().min(1, "Enter account level"),
});

type FormValues = z.infer<typeof schema>;

type CountryOption = { code: string; name: string };

function useCountries() {
  const [options, setOptions] = useState<CountryOption[]>([]);
  useEffect(() => {
    let mounted = true;
    fetch("https://restcountries.com/v3.1/all?fields=name,cca2")
      .then((r) => r.json())
      .then((data: any[]) => {
        if (!mounted) return;
        const opts: CountryOption[] = data
          .map((c) => ({ code: c?.cca2, name: c?.name?.common }))
          .filter((c) => c.code && c.name)
          .sort((a, b) => a.name.localeCompare(b.name));
        if (opts.length) setOptions(opts);
      })
      .catch(() => {
        const fallback: CountryOption[] = [
          { code: "PK", name: "Pakistan" },
          { code: "US", name: "United States" },
          { code: "GB", name: "United Kingdom" },
          { code: "AE", name: "United Arab Emirates" },
          { code: "CA", name: "Canada" },
          { code: "DE", name: "Germany" },
          { code: "FR", name: "France" },
          { code: "IN", name: "India" },
          { code: "CN", name: "China" },
          { code: "JP", name: "Japan" },
        ];
        setOptions(fallback);
      });
    return () => {
      mounted = false;
    };
  }, []);
  return options;
}

export default function CreateAccountModal() {
  const [open, setOpen] = useState(false);
  const countries = useCountries();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      region: "PK",
      accountType: "Valorant",
      accountName: "",
      accountCurrency: "VP",
      currencySpent: 0,
      sellingPriceCurrency: "PKR",
      sellingPrice: 0,
      accountLevel: "",
    },
  });

  useEffect(() => {
    const current = form.getValues("region");
    if (countries.length && !countries.some((c) => c.code === current)) {
      form.setValue("region", countries[0].code, { shouldValidate: true });
    }
  }, [countries, form]);

  const accountCurrencyOptions = useMemo(() => {
    const map = new Map<string, { code: string; label: string }>();
    Object.values(gameCurrencies).forEach((arr) => {
      arr.forEach((c) => {
        if (!map.has(c.code)) map.set(c.code, c);
      });
    });
    return Array.from(map.values()).sort((a, b) =>
      a.label.localeCompare(b.label),
    );
  }, []);

  useEffect(() => {
    const opts = accountCurrencyOptions;
    const current = form.getValues("accountCurrency");
    if (!opts.some((o) => o.code === current)) {
      form.setValue("accountCurrency", opts[0]?.code ?? "USD", {
        shouldValidate: true,
      });
    }
  }, [accountCurrencyOptions, form]);

  const onSubmit = (values: FormValues) => {
    toast({
      title: "Account listed",
      description: `${values.accountName} • ${values.accountType} • ${values.sellingPrice} ${values.sellingPriceCurrency}`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="valorant-gradient hover:opacity-90 whitespace-nowrap">
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">List Account</span>
          <span className="sm:hidden">List</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-valorant-gold">
            Create Account
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 text-white border-gray-600 max-h-64">
                          {countries.map((c) => (
                            <SelectItem
                              key={c.code}
                              value={c.code}
                              className="text-white"
                            >
                              {c.name} ({c.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Type</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 text-white border-gray-600">
                          {accountTypes.map((t) => (
                            <SelectItem
                              key={t}
                              value={t}
                              className="text-white"
                            >
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., AceHunter#1234"
                        className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountCurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Currency</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 text-white border-gray-600">
                          {accountCurrencyOptions.map((c) => (
                            <SelectItem
                              key={c.code}
                              value={c.code}
                              className="text-white"
                            >
                              {c.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currencySpent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency Spent</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min={0}
                          step="1"
                          value={
                            Number.isNaN(field.value as number)
                              ? 0
                              : field.value
                          }
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                          placeholder="e.g., 2200"
                        />
                        <div className="px-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-gray-300 min-w-[4rem] text-center">
                          {form.getValues("accountCurrency")}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-1 md:col-span-2">
                <Label>Account Owner</Label>
                <div className="mt-2 px-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-gray-300">
                  You are the owner of this account.
                </div>
              </div>

              <FormField
                control={form.control}
                name="sellingPriceCurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selling Price Currency</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 text-white border-gray-600 max-h-64">
                          {priceCurrencies.map((c) => (
                            <SelectItem
                              key={c}
                              value={c}
                              className="text-white"
                            >
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sellingPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selling Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="1"
                        value={
                          Number.isNaN(field.value as number) ? 0 : field.value
                        }
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                        placeholder="e.g., 5000"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Level</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., 150"
                        className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-valorant-red hover:bg-valorant-red/80 text-white"
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
