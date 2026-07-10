"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { scrollToSection } from "@/lib/scroll-to-section";
import { searchIndex } from "@/lib/search-index";

const SECTION_ORDER = [
  "inicio",
  "painel-de-impacto",
  "experiencia-profissional",
  "projetos",
  "tecnologias",
  "matriz-de-competencias",
  "competencias-comportamentais",
  "formacao-academica",
  "monitorias-academicas",
];

const groupedIndex = SECTION_ORDER.map((sectionId) => {
  const items = searchIndex.filter((item) => item.sectionId === sectionId);
  return { sectionId, sectionLabel: items[0]?.sectionLabel ?? sectionId, items };
}).filter((group) => group.items.length > 0);

export function SearchCommand() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleSelect(sectionId: string) {
    setOpen(false);
    scrollToSection(sectionId);
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        aria-label="Pesquisar no currículo"
        className="gap-2 text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">Pesquisar…</span>
        <kbd className="hidden items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-flex">
          Ctrl K
        </kbd>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Pesquisar no currículo"
        description="Busque por uma seção, empresa, competência ou categoria do currículo."
      >
        <CommandInput placeholder="Buscar por seção, empresa, competência…" />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          {groupedIndex.map((group) => (
            <CommandGroup key={group.sectionId} heading={group.sectionLabel}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.title}
                  keywords={item.keywords}
                  onSelect={() => handleSelect(item.sectionId)}
                >
                  <div className="flex flex-col">
                    <span>{item.title}</span>
                    {item.subtitle ? (
                      <span className="text-xs text-muted-foreground">
                        {item.subtitle}
                      </span>
                    ) : null}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
