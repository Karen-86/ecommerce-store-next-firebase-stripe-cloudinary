import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";

type Item = {
  label: string;
  value: string;
};

type ToggleGroupDemoProps = React.ComponentProps<typeof ToggleGroupPrimitive.Root> & {
  items?: Item[];
  label?: string;
  hasDefaultValue?: boolean;
  onClear?: () => void;
};

export function ToggleGroupDemo({
  items = [],
  label = "",
  hasDefaultValue = false,
  onClear = () => {},
  ...props
}: ToggleGroupDemoProps) {
  return (
    <div className="grid gap-1">
      <div className="flex gap-2 justify-between items center">
        <Label className="text-xs uppercase tracking-wide font-medium w-fit text-secondary-v2">{label}</Label>
        {!hasDefaultValue && (
          <div
            className="text-[10px] text-primary/80 hover:text-primary cursor-pointer font-semibold uppercase"
            onClick={onClear}
          >
            Clear
          </div>
        )}
      </div>
      <ToggleGroup className="flex-wrap" spacing={2} {...props}>
        {items.map((item) => {
          return (
            <ToggleGroupItem
              key={item.value}
              value={item.value}
              className="cursor-pointer bg-primary/7 text-secondary-v4 font-semibold text-xs hover:bg-primary/15 hover:text-black/60 data-[state=on]:bg-primary data-[state=on]:text-white"
              aria-label={item.label}
              variant="ghostStrong"
              size="sm"
            >
              {item.label}
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    </div>
  );
}
