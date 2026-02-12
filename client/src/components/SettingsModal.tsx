import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { UserSettings } from "@shared/schema";
import { loginAdmin } from "@/lib/auth";
import { motion } from "framer-motion";
import { KeyRound } from "lucide-react";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: UserSettings;
  onSettingsChange: (settings: UserSettings) => void;
  onAdminLogin: () => void;
}

export function SettingsModal({
  open,
  onOpenChange,
  settings,
  onSettingsChange,
  onAdminLogin,
}: SettingsModalProps) {
  const [password, setPassword] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const { toast } = useToast();

  const handleAdminAuth = async () => {
    const success = await loginAdmin(password);
    
    if (success) {
      onAdminLogin();
      toast({
        title: "Acesso Admin Concedido",
        description: "Bem-vindo ao painel administrativo!",
      });
      setPassword("");
      setShowPasswordInput(false);
      onOpenChange(false);
    } else {
      toast({
        title: "Senha Incorreta",
        description: "A senha fornecida está incorreta.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="modal-settings">
        <DialogHeader>
          <DialogTitle className="font-lora text-2xl">Configurações</DialogTitle>
          <DialogDescription className="font-poppins">
            Personalize sua experiência de leitura
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6 py-4"
        >
          <div className="space-y-2">
            <Label htmlFor="font" className="font-poppins font-medium">
              Fonte de Leitura
            </Label>
            <Select
              value={settings.font}
              onValueChange={(value: "lora" | "merriweather" | "poppins") =>
                onSettingsChange({ ...settings, font: value })
              }
            >
              <SelectTrigger id="font" data-testid="select-font">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lora">Lora (Elegante)</SelectItem>
                <SelectItem value="merriweather">Merriweather (Clássico)</SelectItem>
                <SelectItem value="poppins">Poppins (Moderno)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="textSize" className="font-poppins font-medium">
              Tamanho do Texto
            </Label>
            <Select
              value={settings.textSize}
              onValueChange={(value: "small" | "medium" | "large") =>
                onSettingsChange({ ...settings, textSize: value })
              }
            >
              <SelectTrigger id="textSize" data-testid="select-text-size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Pequeno</SelectItem>
                <SelectItem value="medium">Médio</SelectItem>
                <SelectItem value="large">Grande</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="particles" className="font-poppins font-medium">
              Partículas Mágicas
            </Label>
            <Switch
              id="particles"
              checked={settings.particlesEnabled}
              onCheckedChange={(checked) =>
                onSettingsChange({ ...settings, particlesEnabled: checked })
              }
              data-testid="switch-particles"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="music" className="font-poppins font-medium">
              Música de Fundo
            </Label>
            <Switch
              id="music"
              checked={settings.musicEnabled}
              onCheckedChange={(checked) =>
                onSettingsChange({ ...settings, musicEnabled: checked })
              }
              data-testid="switch-music"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme" className="font-poppins font-medium">
              Tema
            </Label>
            <Select
              value={settings.theme}
              onValueChange={(value: "light" | "dark") =>
                onSettingsChange({ ...settings, theme: value })
              }
            >
              <SelectTrigger id="theme" data-testid="select-theme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Claro</SelectItem>
                <SelectItem value="dark">Escuro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 border-t">
            {!showPasswordInput ? (
              <Button
                onClick={() => setShowPasswordInput(true)}
                variant="outline"
                className="w-full"
                data-testid="button-show-credentials"
              >
                <KeyRound className="mr-2 h-4 w-4" />
                Painel de Admin
              </Button>
            ) : (
              <div className="space-y-3">
                <Label htmlFor="password" className="font-poppins font-medium">
                  Senha de Administrador
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite a senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdminAuth()}
                    data-testid="input-admin-password"
                  />
                  <Button onClick={handleAdminAuth} data-testid="button-submit-password">
                    Entrar
                  </Button>
                </div>
                <Button
                  onClick={() => {
                    setShowPasswordInput(false);
                    setPassword("");
                  }}
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  data-testid="button-cancel-password"
                >
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
