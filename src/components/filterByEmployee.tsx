import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CommandList } from "cmdk";

type InputProps = {
  employees: { value: string; label: string }[];
  setEmployee: (e: string) => void;
};

export function ComboboxDemo({ employees, setEmployee }: InputProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? employees.find((employee) => employee.value === value)?.label
            : "Select Employee..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {employees.map((employee) => (
                <CommandItem
                  key={employee.value}
                  value={employee.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setEmployee(currentValue);
                    setOpen(false);
                  }}
                >
                  {employee.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === employee.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
