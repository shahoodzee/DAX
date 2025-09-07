import { useEffect, useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Option {
  code: string; // e.g. +1
  label: string; // e.g. United States (+1)
}

const fallback: Option[] = [
  { code: "+1", label: "United States (+1)" },
  { code: "+44", label: "United Kingdom (+44)" },
  { code: "+61", label: "Australia (+61)" },
  { code: "+81", label: "Japan (+81)" },
  { code: "+49", label: "Germany (+49)" },
  { code: "+33", label: "France (+33)" },
  { code: "+971", label: "United Arab Emirates (+971)" },
  { code: "+92", label: "Pakistan (+92)" },
  { code: "+91", label: "India (+91)" },
  { code: "+86", label: "China (+86)" },
];

export default function CountryCodeSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [options, setOptions] = useState<Option[]>(fallback);

  useEffect(() => {
    let mounted = true;
    fetch("https://restcountries.com/v3.1/all?fields=name,idd")
      .then((r) => r.json())
      .then((data: any[]) => {
        if (!mounted) return;
        const map = new Map<string, Option>();
        for (const c of data) {
          const root: string | undefined = c?.idd?.root;
          const suffixes: string[] | undefined = c?.idd?.suffixes;
          const name = c?.name?.common as string | undefined;
          if (!root || !Array.isArray(suffixes) || !name) continue;
          const first = suffixes[0] ?? "";
          const code = `${root}${first}`;
          if (!code) continue;
          if (!map.has(code)) {
            map.set(code, { code, label: `${name} (${code})` });
          }
        }
        const opts = Array.from(map.values());
        if (opts.length > 0) {
          opts.sort((a, b) => a.label.localeCompare(b.label));
          setOptions(opts);
        }
      })
      .catch(() => {
        // keep fallback
      });
    return () => {
      mounted = false;
    };
  }, []);

  const currentLabel = useMemo(() => options.find((o) => o.code === value)?.label ?? value, [options, value]);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
        <SelectValue placeholder="Select code" aria-label={currentLabel} />
      </SelectTrigger>
      <SelectContent className="bg-gray-800 text-white border-gray-600">
        {options.map((o) => (
          <SelectItem key={o.code} value={o.code} className="text-white">
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
