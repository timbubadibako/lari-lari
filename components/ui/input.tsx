import { cn } from '@/lib/utils';
import { Platform, TextInput } from 'react-native';

function Input({ className, ...props }: React.ComponentProps<typeof TextInput> & React.RefAttributes<TextInput>) {
  return (
    <TextInput
      className={cn(
        'w-full bg-white/5 border-b border-sky-500/20 py-4 px-4 text-sm tracking-widest text-white transition-all',
        props.editable === false &&
        cn(
          'opacity-50',
          Platform.select({ web: 'disabled:pointer-events-none disabled:cursor-not-allowed' })
        ),
        Platform.select({
          web: cn(
            'placeholder:text-slate-700 outline-none transition-[color,box-shadow]',
            'focus-visible:border-sky-500 focus-visible:bg-sky-500/5 focus-visible:pl-6',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
          ),
          native: 'placeholder:text-slate-700 focus:border-sky-500 focus:bg-sky-500/5 focus:pl-6',
        }),
        className
      )}
      placeholderTextColor="#334155"
      {...props}
    />
  );
}

export { Input };
