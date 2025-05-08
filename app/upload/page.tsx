"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, X, Plus, Loader2, ArrowLeft, FileCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Header } from "@/components/header";

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList) => {
    const validFiles = Array.from(fileList).filter((file) => {
      const fileType = file.type.toLowerCase();
      return (
        fileType === "application/pdf" ||
        fileType === "image/jpeg" ||
        fileType === "image/jpg" ||
        fileType === "image/png"
      );
    });

    if (validFiles.length !== fileList.length) {
      Swal.fire({
        title: "Неподдерживаемый формат",
        text: "Поддерживаются только PDF и изображения (JPG, JPEG, PNG)",
        icon: "error",
        confirmButtonColor: "#10b981",
      });

      if (validFiles.length === 0) return;
    }

    setUploading(true);

    const newFiles = validFiles.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      file: file,
      uploaded: false,
    }));

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setUploading(false);
          setUploadProgress(0);

          setFiles((prev) => [...prev, ...newFiles.map((file) => ({ ...file, uploaded: true }))]);

          Swal.fire({
            title: "Успешно!",
            text: `${newFiles.length} файл(ов) загружено`,
            icon: "success",
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
          });
        }, 500);
      }
    }, 100);
  };

  const removeFile = (id) => {
    Swal.fire({
      title: "Удалить файл?",
      text: "Вы уверены, что хотите удалить этот файл?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Да, удалить",
      cancelButtonText: "Отмена",
    }).then((result) => {
      if (result.isConfirmed) {
        setFiles(files.filter((file) => file.id !== id));

        Swal.fire({
          title: "Удалено!",
          text: "Файл был успешно удален",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleAnalyze = async () => {
    if (files.length === 0) {
      Swal.fire({
        title: "Ошибка",
        text: "Пожалуйста, загрузите хотя бы один документ",
        icon: "error",
        confirmButtonColor: "#10b981",
      });
      return;
    }

    const token = Cookies.get("token");
    console.log("Token:", token);
    if (!token) {
      Swal.fire({
        title: "Ошибка",
        text: "Пользователь не аутентифицирован. Пожалуйста, войдите снова.",
        icon: "error",
        confirmButtonColor: "#10b981",
      }).then(() => {
        router.push("/auth/login");
      });
      return;
    }

    setAnalyzing(true);
    let progress = 0;

    try {
      // Create case with minimal data
      const caseResponse = await fetch("/api/cases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}), // Minimal payload; title, description, deadline set by /api/upload
      });

      if (!caseResponse.ok) {
        const errorText = await caseResponse.text();
        throw new Error(`Failed to create case: ${errorText}`);
      }

      const caseData = await caseResponse.json();
      const caseId = caseData._id;

      const formData = new FormData();
      formData.append("caseId", caseId);
      files.forEach((fileObj) => {
        formData.append("files", fileObj.file);
      });

      const interval = setInterval(() => {
        progress += 1;
        setAnalyzeProgress(progress);

        if (progress >= 99) {
          clearInterval(interval);
        }
      }, 50);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`Failed to upload and analyze files: ${errorText}`);
      }

      const uploadData = await uploadResponse.json();
      const { title, description, deadline } = uploadData;

      clearInterval(interval);
      setAnalyzeProgress(100);

      setTimeout(() => {
        setAnalyzing(false);

        Swal.fire({
          title: "Анализ успешно завершен!",
          html: `
            <p>Дело "${title}" создано и готово к рассмотрению.</p>
            <p><strong>Описание:</strong> ${description}</p>
            <p><strong>Дедлайн:</strong> ${deadline}</p>
          `,
          icon: "success",
          confirmButtonText: "Перейти к делам",
          confirmButtonColor: "#10b981",
        }).then(() => {
          router.push("/dashboard");
        });
      }, 500);
    } catch (error) {
      console.error("Error processing files:", error);

      setAnalyzing(false);

      Swal.fire({
        title: "Ошибка",
        text: "Произошла ошибка при обработке файлов. Пожалуйста, попробуйте снова.",
        icon: "error",
        confirmButtonColor: "#10b981",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header currentPath="/upload" />
      <main className="flex-1 container py-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад
            </Link>
          </Button>
          <div className="text-sm text-muted-foreground">/ Загрузка документов</div>
        </div>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Загрузка документов</h1>

          <div className="space-y-6">
            <Card
              className={`transition-all duration-300 hover:shadow-md ${dragActive ? "ring-2 ring-emerald-500" : ""}`}
            >
              <CardHeader>
                <CardTitle>Загрузка документов</CardTitle>
                <CardDescription>Загрузите все необходимые документы для анализа</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                      dragActive
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-muted-foreground/25 hover:border-emerald-300 hover:bg-emerald-50/50"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Upload
                        className={`h-10 w-10 ${dragActive ? "text-emerald-500 animate-bounce" : "text-muted-foreground"}`}
                      />
                      <h3 className="font-medium text-lg">Перетащите файлы сюда</h3>
                      <p className="text-sm text-muted-foreground">Поддерживаются PDF и изображения (JPG, JPEG, PNG)</p>
                      <p className="text-sm text-muted-foreground">или</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileInput}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <Button
                        onClick={() => fileInputRef.current.click()}
                        className="bg-emerald-600 hover:bg-emerald-700 transition-all duration-200 hover:shadow-lg"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Выбрать файлы
                      </Button>
                    </div>
                  </div>

                  {uploading && (
                    <div className="space-y-2 animate-fadeIn">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center">
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Загрузка...
                        </span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2 transition-all duration-300" />
                    </div>
                  )}

                  <div className="space-y-2">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 border rounded-lg transition-all duration-200 hover:bg-muted/30 animate-slideIn"
                      >
                        <div className="flex items-center gap-3">
                          <FileCheck className="h-5 w-5 text-emerald-600" />
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">{file.size}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(file.id)}
                          className="hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {analyzing && (
              <Card className="animate-fadeIn">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Анализ документов
                  </CardTitle>
                  <CardDescription>ИИ анализирует загруженные документы</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Прогресс анализа</span>
                        <span>{analyzeProgress}%</span>
                      </div>
                      <Progress value={analyzeProgress} className="h-2 transition-all duration-300" />
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      {analyzeProgress > 10 && <p className="animate-fadeIn">• Извлечение текста из документов...</p>}
                      {analyzeProgress > 30 && <p className="animate-fadeIn">• Идентификация ключевой информации...</p>}
                      {analyzeProgress > 50 && <p className="animate-fadeIn">• Проверка полноты документации...</p>}
                      {analyzeProgress > 70 && (
                        <p className="animate-fadeIn">• Оценка рисков и формирование SWOT-анализа...</p>
                      )}
                      {analyzeProgress > 90 && <p className="animate-fadeIn">• Формирование итогового отчета...</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                className="transition-all duration-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                onClick={() => {
                  Swal.fire({
                    title: "Отменить загрузку?",
                    text: "Все несохраненные данные будут потеряны",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonColor: "#10b981",
                    cancelButtonColor: "#ef4444",
                    confirmButtonText: "Да, отменить",
                    cancelButtonText: "Нет, продолжить",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      router.push("/dashboard");
                    }
                  });
                }}
              >
                Отмена
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 transition-all duration-200 hover:shadow-lg"
                onClick={handleAnalyze}
                disabled={analyzing || !Cookies.get("token")}
              >
                {analyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Анализ...
                  </>
                ) : (
                  <>Отправить на анализ</>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}