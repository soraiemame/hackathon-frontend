import { useState, useEffect, useRef } from "react";
import type { ChangeEvent } from "react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "../types/user";
import { useProfileUpdate } from "../hooks/useProfile";

import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Edit, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
//

//

interface ProfileHeaderProps {
  user: User;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  // const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editUsername, setEditUsername] = useState(user.username || "");
  // ▼ 追加: 画像アップロード用State
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ▼ 変更: useProfileUpdateフックを使用
  const { mutate: updateProfile, isPending } = useProfileUpdate();

  useEffect(() => {
    setEditUsername(user.username || "");
  }, [user]);
  useEffect(() => {
    if (isEditOpen) {
      setPreviewUrl(user.icon_url);
      setSelectedFile(undefined);
    }
  }, [isEditOpen, user.icon_url]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleProfileSave = () => {
    updateProfile(
      { userId: user.id, username: editUsername, file: selectedFile },
      {
        onSuccess: () => setIsEditOpen(false),
      },
    );
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <Avatar className="h-24 w-24 border">
            {/* borderを追加 */}
            {/* user.icon_url を表示 */}
            <AvatarImage
              src={user.icon_url || "/placeholder.svg"}
              className="object-cover"
            />
            <AvatarFallback>
              {(user.username || user.email)[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3">
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  {user.username || user.email}
                </h1>
                <p className="text-muted-foreground text-sm">
                  @{user.username || "..."} | {user.created_at}から利用
                </p>
              </div>
              <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    プロフィール編集
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>プロフィール編集</DialogTitle>
                    <DialogDescription>
                      プロフィール情報を更新してください
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    {/* ▼ 追加: アイコン編集エリア */}
                    <div className="flex flex-col items-center gap-4">
                      <Avatar
                        className="h-24 w-24 border cursor-pointer hover:opacity-80"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <AvatarImage
                          src={previewUrl || "/placeholder.svg"}
                          className="object-cover"
                        />
                        <AvatarFallback>Upload</AvatarFallback>
                      </Avatar>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        画像を変更
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username">ユーザー名</Label>
                      <Input
                        id="username"
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">メールアドレス (変更不可)</Label>
                      <Input id="email" value={user.email} disabled />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditOpen(false)}
                    >
                      キャンセル
                    </Button>
                    <Button onClick={handleProfileSave} disabled={isPending}>
                      {isPending ? "保存中..." : "保存"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
