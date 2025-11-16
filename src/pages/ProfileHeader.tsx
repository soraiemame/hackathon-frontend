import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/client";
import type { User } from "../types/user";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Edit } from "lucide-react";
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
async function updateProfile(vars: {
  userId: number;
  data: { username: string | null };
}): Promise<User> {
  const { data } = await apiClient.put(`/api/users/${vars.userId}`, vars.data);
  return data;
}

interface ProfileHeaderProps {
  user: User;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editUsername, setEditUsername] = useState(user.username || "");

  useEffect(() => {
    setEditUsername(user.username || "");
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["myProfile"], updatedUser);
      setIsEditOpen(false);
      alert("プロフィールを更新しました。");
    },
    onError: () => {
      alert("更新に失敗しました。");
    },
  });

  const handleProfileSave = () => {
    updateMutation.mutate({
      userId: user.id,
      data: { username: editUsername },
    });
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <Avatar className="h-24 w-24">
            <AvatarImage src={"/placeholder.svg"} />
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
                    <Button
                      onClick={handleProfileSave}
                      disabled={updateMutation.isPending}
                    >
                      {updateMutation.isPending ? "保存中..." : "保存"}
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
