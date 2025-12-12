// src/components/confirm-dialog.tsx

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog";
import { buttonVariants } from "./buttonVariants"; // ボタンのスタイル定義を使うためimport

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: React.ReactNode; // 文字列だけでなく改行タグなども渡せるように
  actionLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive"; // 赤ボタン(削除など)用
  onAction: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  actionLabel = "続行",
  cancelLabel = "キャンセル",
  variant = "default",
  onAction,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(_e) => {
              // アクション実行
              onAction();
            }}
            // variantがdestructiveの場合、ボタンを赤くするスタイルを適用
            className={
              variant === "destructive"
                ? buttonVariants({ variant: "destructive" })
                : ""
            }
          >
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}