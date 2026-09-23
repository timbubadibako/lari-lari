import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { Platform, Pressable } from 'react-native';

const buttonVariants = cva(
  cn(
    'group shrink-0 flex-row items-center justify-center gap-2 rounded-full shadow-none',
    Platform.select({
      web: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    })
  ),
  {
    variants: {
      variant: {
        default: cn(
          'bg-sky-500 active:bg-sky-400 active:scale-95 shadow-[0_0_30px_rgba(14,165,233,0.3)]',
          Platform.select({ web: 'hover:bg-sky-400' })
        ),
        destructive: cn(
          'bg-red-500 active:bg-red-400 shadow-[0_0_30px_rgba(239,68,68,0.3)] active:scale-95',
          Platform.select({
            web: 'hover:bg-red-400',
          })
        ),
        outline: cn(
          'border-border border bg-transparent active:bg-white/5 active:scale-95',
          Platform.select({
            web: 'hover:bg-white/5',
          })
        ),
        glass: cn(
          'bg-slate-900/60 border border-white/5 active:bg-slate-900/80 active:scale-95',
          Platform.select({ web: 'hover:bg-slate-900/80' })
        ),
        sapphireGlass: cn(
          'bg-sky-500/10 border border-sky-500/30 active:bg-sky-500/20 active:scale-95',
          Platform.select({ web: 'hover:bg-sky-500/20' })
        ),
        ghost: cn(
          'active:bg-white/5 active:scale-95',
          Platform.select({ web: 'hover:bg-white/5' })
        ),
        link: '',
      },
      size: {
        default: cn('h-14 px-8 py-4'),
        sm: cn('h-10 px-6 py-2'),
        lg: cn('h-16 px-10 py-5'),
        icon: 'h-14 w-14',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const buttonTextVariants = cva(
  cn(
    'font-sans uppercase tracking-widest font-bold',
    Platform.select({ web: 'pointer-events-none transition-colors' })
  ),
  {
    variants: {
      variant: {
        default: 'text-slate-900',
        destructive: 'text-white',
        outline: 'text-white',
        glass: 'text-white',
        sapphireGlass: 'text-sky-400',
        ghost: 'text-slate-400 group-active:text-white',
        link: cn(
          'text-sky-500 group-active:underline',
          Platform.select({ web: 'underline-offset-4 hover:underline group-hover:underline' })
        ),
      },
      size: {
        default: 'text-xs',
        sm: 'text-[10px]',
        lg: 'text-sm',
        icon: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type ButtonProps = React.ComponentProps<typeof Pressable> & React.RefAttributes<typeof Pressable> & VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
      <Pressable
        className={cn(props.disabled && 'opacity-50', buttonVariants({ variant, size }), className)}
        role="button"
        {...props}
      />
    </TextClassContext.Provider>
  );
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
