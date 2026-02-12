import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Trash2, Edit, Upload, Music, Image as ImageIcon, LogOut, Loader, Settings, Copy, Check, Code2 } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { logoutAdmin } from "@/lib/auth";
import { useLocation } from "wouter";
import { uploadCoverImage } from "@/lib/uploadImage";
import { ColorPicker } from "@/components/ColorPicker";
import { getCompletePageHTML } from "@/lib/getPageHTML";
import type { Story, Music as MusicType, SiteConfig } from "@shared/schema";

export default function AdminPanel() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [storyForm, setStoryForm] = useState({ title: "", content: "", coverImageUrl: "" });
  const [deleteStoryId, setDeleteStoryId] = useState<string | null>(null);
  const [deleteMusicId, setDeleteMusicId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [htmlCopied, setHtmlCopied] = useState(false);
  const [pageHTML, setPageHTML] = useState(getCompletePageHTML());

  const { data: stories } = useQuery<Story[]>({ queryKey: ["/api/stories"] });
  const { data: musicList } = useQuery<MusicType[]>({ queryKey: ["/api/music"] });
  const { data: siteConfig } = useQuery<SiteConfig>({ queryKey: ["/api/site-config"] });
  const [configForm, setConfigForm] = useState<Partial<SiteConfig>>({});

  const createStoryMutation = useMutation({
    mutationFn: (data: { title: string; content: string; coverImageUrl: string }) =>
      apiRequest("POST", "/api/stories", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stories"] });
      setStoryForm({ title: "", content: "", coverImageUrl: "" });
      toast({ title: "História criada com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao criar história", variant: "destructive" });
    },
  });

  const updateStoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { title: string; content: string; coverImageUrl: string } }) =>
      apiRequest("PUT", `/api/stories/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stories"] });
      setEditingStory(null);
      setStoryForm({ title: "", content: "", coverImageUrl: "" });
      toast({ title: "História atualizada com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao atualizar história", variant: "destructive" });
    },
  });

  const deleteStoryMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/stories/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stories"] });
      setDeleteStoryId(null);
      toast({ title: "História excluída com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao excluir história", variant: "destructive" });
    },
  });

  const deleteMusicMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/music/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/music"] });
      setDeleteMusicId(null);
      toast({ title: "Música excluída com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao excluir música", variant: "destructive" });
    },
  });

  const updateConfigMutation = useMutation({
    mutationFn: (data: Partial<SiteConfig>) => apiRequest("PUT", "/api/site-config", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-config"] });
      toast({ title: "Configurações atualizadas com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao atualizar configurações", variant: "destructive" });
    },
  });

  useEffect(() => {
    if (siteConfig) {
      setConfigForm(siteConfig);
    }
  }, [siteConfig]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!storyForm.title.trim()) {
      toast({ title: "Erro", description: "Título é obrigatório", variant: "destructive" });
      return;
    }
    
    if (!storyForm.content.trim()) {
      toast({ title: "Erro", description: "Conteúdo é obrigatório", variant: "destructive" });
      return;
    }
    
    if (!storyForm.coverImageUrl.trim()) {
      toast({ title: "Erro", description: "Imagem é obrigatória. Faça upload de uma imagem primeiro.", variant: "destructive" });
      return;
    }
    
    if (editingStory) {
      updateStoryMutation.mutate({ id: editingStory.id, data: storyForm });
    } else {
      createStoryMutation.mutate(storyForm);
    }
  };

  const handleEdit = (story: Story) => {
    setEditingStory(story);
    setStoryForm({
      title: story.title,
      content: story.content,
      coverImageUrl: story.coverImageUrl,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('Iniciando upload de arquivo:', file);
    setUploadingImage(true);
    try {
      const url = await uploadCoverImage(file);
      console.log('URL recebida do upload:', url);
      setStoryForm({ ...storyForm, coverImageUrl: url });
      toast({ title: "Imagem enviada com sucesso!" });
      // Limpar o input
      e.target.value = '';
    } catch (error) {
      console.error('Erro no handleImageUpload:', error);
      toast({ 
        title: "Erro ao enviar imagem", 
        description: error instanceof Error ? error.message : "Tente novamente",
        variant: "destructive" 
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setLocation("/");
    toast({ title: "Sessão admin encerrada" });
  };

  return (
    <div className="min-h-screen pb-12">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-lora">Painel Administrativo</h1>
            <p className="text-muted-foreground font-poppins mt-2">
              Gerencie histórias e músicas
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline" data-testid="button-logout">
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </motion.div>

        <Tabs defaultValue="stories" className="space-y-6">
          <TabsList className="grid w-full max-w-4xl grid-cols-4">
            <TabsTrigger value="stories" data-testid="tab-stories">
              <ImageIcon className="mr-2 h-4 w-4" />
              Histórias
            </TabsTrigger>
            <TabsTrigger value="music" data-testid="tab-music">
              <Music className="mr-2 h-4 w-4" />
              Músicas
            </TabsTrigger>
            <TabsTrigger value="config" data-testid="tab-config">
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </TabsTrigger>
            <TabsTrigger value="html" data-testid="tab-html">
              <Code2 className="mr-2 h-4 w-4" />
              Código HTML
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-lora">
                  {editingStory ? "Editar História" : "Nova História"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={storyForm.title}
                      onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
                      required
                      data-testid="input-story-title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coverImage">Imagem da Capa</Label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          id="coverImage"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                          data-testid="input-cover-image"
                        />
                      </div>
                      {storyForm.coverImageUrl && (
                        <img 
                          src={storyForm.coverImageUrl} 
                          alt="Prévia da capa" 
                          className="h-10 w-10 object-cover rounded"
                        />
                      )}
                    </div>
                    {uploadingImage && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader className="h-4 w-4 animate-spin" />
                        Enviando imagem...
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Conteúdo</Label>
                    <Textarea
                      id="content"
                      value={storyForm.content}
                      onChange={(e) => setStoryForm({ ...storyForm, content: e.target.value })}
                      required
                      rows={12}
                      className="font-merriweather"
                      data-testid="textarea-story-content"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={createStoryMutation.isPending || updateStoryMutation.isPending} data-testid="button-save-story">
                      {editingStory ? <Edit className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                      {editingStory ? "Atualizar" : "Criar"} História
                    </Button>
                    {editingStory && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingStory(null);
                          setStoryForm({ title: "", content: "", coverImageUrl: "" });
                        }}
                        data-testid="button-cancel-edit"
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {stories?.map((story) => (
                <Card key={story.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={story.coverImageUrl}
                        alt={story.title}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold font-lora text-lg mb-1" data-testid={`text-admin-story-${story.id}`}>
                          {story.title}
                        </h3>
                        <p className="text-sm text-muted-foreground font-merriweather line-clamp-2">
                          {story.content.substring(0, 150)}...
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleEdit(story)}
                          data-testid={`button-edit-${story.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => setDeleteStoryId(story.id)}
                          data-testid={`button-delete-${story.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="music" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-lora">Gerenciar Músicas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground font-poppins">
                  As músicas devem ser adicionadas manualmente ao Firebase Storage e registradas no Firestore.
                </p>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {musicList?.map((music) => (
                <Card key={music.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Music className="h-5 w-5 text-primary" />
                        <div>
                          <h3 className="font-medium font-poppins" data-testid={`text-music-${music.id}`}>
                            {music.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {new Date(music.uploadedAt).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => setDeleteMusicId(music.id)}
                        data-testid={`button-delete-music-${music.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="config" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-lora">Configurações do Site</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); updateConfigMutation.mutate(configForm); }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ColorPicker
                      value={configForm.primaryColor || "270 70% 55%"}
                      onChange={(v) => setConfigForm({ ...configForm, primaryColor: v })}
                      label="Cor Primária"
                      placeholder="ex: 270 70% 55%"
                    />
                    <ColorPicker
                      value={configForm.accentColor || "300 35% 90%"}
                      onChange={(v) => setConfigForm({ ...configForm, accentColor: v })}
                      label="Cor de Destaque"
                      placeholder="ex: 300 35% 90%"
                    />
                    <ColorPicker
                      value={configForm.secondaryColor || "280 25% 85%"}
                      onChange={(v) => setConfigForm({ ...configForm, secondaryColor: v })}
                      label="Cor Secundária"
                      placeholder="ex: 280 25% 85%"
                    />
                    <ColorPicker
                      value={configForm.backgroundColor || "240 25% 97%"}
                      onChange={(v) => setConfigForm({ ...configForm, backgroundColor: v })}
                      label="Cor de Fundo"
                      placeholder="ex: 240 25% 97%"
                    />
                    <ColorPicker
                      value={configForm.foregroundColor || "270 20% 90%"}
                      onChange={(v) => setConfigForm({ ...configForm, foregroundColor: v })}
                      label="Cor da Fonte"
                      placeholder="ex: 270 20% 90%"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="heroTitle">Título do Hero</Label>
                    <Input
                      id="heroTitle"
                      value={configForm.heroTitle || ""}
                      onChange={(e) => setConfigForm({ ...configForm, heroTitle: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="heroSubtitle">Subtítulo do Hero</Label>
                    <Textarea
                      id="heroSubtitle"
                      value={configForm.heroSubtitle || ""}
                      onChange={(e) => setConfigForm({ ...configForm, heroSubtitle: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customHTML">HTML Customizado (Injetado no Hero)</Label>
                    <Textarea
                      id="customHTML"
                      value={configForm.customHTML || ""}
                      onChange={(e) => setConfigForm({ ...configForm, customHTML: e.target.value })}
                      rows={6}
                      placeholder="Ex: <div class='custom-banner'>Seu HTML aqui</div>"
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Digite qualquer HTML que deseja injetar na página hero. Pode incluir tags, classes Tailwind, etc.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={updateConfigMutation.isPending} data-testid="button-save-config">
                      <Settings className="mr-2 h-4 w-4" />
                      Salvar Configurações
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="font-lora text-sm flex items-center justify-between">
                  Código CSS das Variáveis
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const cssCode = `:root {
  --primary: ${configForm.primaryColor};
  --accent: ${configForm.accentColor};
  --secondary: ${configForm.secondaryColor};
  --background: ${configForm.backgroundColor};
  --foreground: ${configForm.foregroundColor};
}`;
                      navigator.clipboard.writeText(cssCode);
                      setHtmlCopied(true);
                      setTimeout(() => setHtmlCopied(false), 2000);
                    }}
                  >
                    {htmlCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">
                  Código CSS gerado automaticamente. Copie para usar em seus estilos customizados.
                </p>
                <pre className="bg-card p-3 rounded text-xs overflow-auto max-h-40 font-mono border">
{`:root {
  --primary: ${configForm.primaryColor};
  --accent: ${configForm.accentColor};
  --secondary: ${configForm.secondaryColor};
  --background: ${configForm.backgroundColor};
  --foreground: ${configForm.foregroundColor};
}`}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="html" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-lora">Código HTML da Página</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); updateConfigMutation.mutate(configForm); }}>
                  <div className="space-y-2">
                    <Label htmlFor="pageHTML">HTML Completo da Página Principal (index.html)</Label>
                    <Textarea
                      id="pageHTML"
                      value={pageHTML}
                      onChange={(e) => setPageHTML(e.target.value)}
                      rows={12}
                      placeholder="Cole o HTML da página aqui"
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Este é o código HTML completo da página. Você pode editá-lo diretamente aqui e fazer alterações programáticas.
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(pageHTML);
                        setHtmlCopied(true);
                        setTimeout(() => setHtmlCopied(false), 2000);
                        toast({ title: "HTML copiado para clipboard" });
                      }}
                      type="button"
                    >
                      {htmlCopied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                      Copiar HTML
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setPageHTML(getCompletePageHTML())}
                      type="button"
                    >
                      Restaurar HTML Padrão
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="font-lora text-sm">Sobre o HTML</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">
                  Você pode editar o código HTML completo da página. As mudanças não serão aplicadas imediatamente - você precisará fazer deploy novamente para que as alterações entrem em vigor.
                </p>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
                  <li>Adicione novas meta tags para SEO</li>
                  <li>Modifique o título da página (title tag)</li>
                  <li>Adicione scripts de rastreamento (Google Analytics, etc.)</li>
                  <li>Customize a estrutura base do HTML</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={!!deleteStoryId} onOpenChange={() => setDeleteStoryId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta história? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteStoryId && deleteStoryMutation.mutate(deleteStoryId)}
              data-testid="button-confirm-delete"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteMusicId} onOpenChange={() => setDeleteMusicId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta música? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMusicId && deleteMusicMutation.mutate(deleteMusicId)}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
