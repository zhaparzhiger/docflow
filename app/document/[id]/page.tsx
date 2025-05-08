"use client";

import React from "react"; // Added explicit React import
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  Users,
  Calendar,
  MapPin,
  Bus,
  Home,
  Shield,
  ArrowLeft,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  Eye,
  FileCheck,
  FileWarning,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Swal from "sweetalert2";
import { useRouter, useParams } from "next/navigation";
import { Header } from "@/components/header";
import Cookies from "js-cookie";

export default function DocumentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [activeTab, setActiveTab] = useState("overview");
  const [requestingDocument, setRequestingDocument] = useState(false);
  const [processingDecision, setProcessingDecision] = useState(false);
  const [loading, setLoading] = useState(true);
  const [caseData, setCaseData] = useState(null);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    if (!id) return;

    const fetchCaseData = async () => {
      try {
        const response = await fetch(`/api/cases/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch case data");
        }

        const data = await response.json();
        setCaseData(data);
        setDocuments(data.documents || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching case data:", error);
        setLoading(false);

        Swal.fire({
          title: "Ошибка",
          text: "Не удалось загрузить данные дела",
          icon: "error",
          confirmButtonColor: "#10b981",
        }).then(() => {
          router.push("/cases");
        });
      }
    };

    fetchCaseData();
  }, [id, router]);

  const handleViewDocument = async (doc) => {
    try {
      const response = await fetch(`/api/documents/${doc._id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch document");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const isImage = ["image/jpeg", "image/jpg", "image/png"].includes(doc.type);
      const isPDF = doc.type === "application/pdf";

      let previewHtml = "";
      if (isPDF) {
        previewHtml = `<iframe src="${url}" class="w-full h-64 border border-dashed border-gray-300 rounded"></iframe>`;
      } else if (isImage) {
        previewHtml = `<img src="${url}" alt="${doc.name}" class="w-full h-64 object-contain rounded" />`;
      } else {
        throw new Error("Unsupported file type for preview");
      }

      Swal.fire({
        title: `${doc.name}`,
        html: `
          <div class="text-left p-5 bg-gray-50 rounded-lg mb-5">
            <div class="text-2xl mb-3 text-emerald-600">Документ: ${doc.name}</div>
            <div class="text-gray-600 mb-2">Тип файла: ${doc.type} | Размер: ${(doc.size / (1024 * 1024)).toFixed(1)} MB</div>
            ${previewHtml}
          </div>
        `,
        width: "90%",
        maxWidth: 700,
        showCloseButton: true,
        showConfirmButton: false,
        customClass: {
          container: "document-preview-container",
        },
        didClose: () => {
          URL.revokeObjectURL(url);
        },
      });
    } catch (error) {
      console.error("Error viewing document:", error);
      Swal.fire({
        title: "Ошибка",
        text: "Не удалось загрузить документ для предпросмотра",
        icon: "error",
        confirmButtonColor: "#10b981",
      });
    }
  };

  const handleRequestDocument = (docName) => {
    setRequestingDocument(true);

    setTimeout(() => {
      setRequestingDocument(false);

      Swal.fire({
        title: "Запрос отправлен",
        html: `
          <div class="text-left">
            <p>Запрос на предоставление документа "${docName}" успешно отправлен организатору.</p>
            <p class="mt-2">Ожидаемое время ответа: <strong>24 часа</strong></p>
          </div>
        `,
        icon: "success",
        confirmButtonText: "Понятно",
        confirmButtonColor: "#10b981",
      });
    }, 1500);
  };

  const handleMakeDecision = async (decision) => {
    setProcessingDecision(true);

    try {
      const response = await fetch(`/api/cases/${id}/decision`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({
          decision,
          user: "Иван Петров",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process decision");
      }

      let title, text, icon;

      if (decision === "approve") {
        title = "Дело одобрено";
        text = "Ваше решение об одобрении дела успешно сохранено и отправлено организатору";
        icon = "success";
      } else if (decision === "request") {
        title = "Запрошена доработка";
        text = "Запрос на доработку успешно отправлен организатору";
        icon = "info";
      } else {
        title = "Дело отклонено";
        text = "Ваше решение об отклонении дела успешно сохранено и отправлено организатору";
        icon = "error";
      }

      Swal.fire({
        title,
        text,
        icon,
        confirmButtonText: "Вернуться к списку дел",
        confirmButtonColor: "#10b981",
      }).then(() => {
        router.push("/cases");
      });
    } catch (error) {
      console.error("Error processing decision:", error);

      Swal.fire({
        title: "Ошибка",
        text: "Не удалось обработать решение. Пожалуйста, попробуйте снова.",
        icon: "error",
        confirmButtonColor: "#10b981",
      });
    } finally {
      setProcessingDecision(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU");
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-amber-500";
      case "low":
        return "text-green-500";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
            Ожидает рассмотрения
          </Badge>
        );
      case "review":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">
            На рассмотрении
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-blue-50">
            Одобрено
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
            Отклонено
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-gray-50">
            Неизвестно
          </Badge>
        );
    }
  };

  const getDeadlineDisplay = (deadline) => {
    if (!deadline) return null;

    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = Math.abs(deadlineDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (deadlineDate < today) {
      return (
        <div className="flex items-center gap-1 text-sm">
          <Clock className="h-4 w-4 text-red-500" />
          <span className="text-red-500">Просрочено</span>
        </div>
      );
    } else if (diffDays <= 3) {
      return (
        <div className="flex items-center gap-1 text-sm">
          <Clock className="h-4 w-4 text-red-500" />
          <span className="text-red-500">
            Дедлайн: {diffDays} {diffDays === 1 ? "день" : "дня"}
          </span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1 text-sm">
          <Clock className="h-4 w-4 text-blue-500" />
          <span className="text-blue-500">Дедлайн: {diffDays} дней</span>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header currentPath="/document/:id" />
        <main className="flex-1 container py-4 sm:py-6">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin mx-auto text-emerald-600 mb-4" />
              <h2 className="text-lg sm:text-xl font-medium">Загрузка данных...</h2>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header currentPath={`/document/${id}`} />
        <main className="flex-1 container py-4 sm:py-6">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <Button variant="outline" size="sm" asChild>
              <Link href="/cases">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад к списку
              </Link>
            </Button>
          </div>
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <AlertTriangle className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-red-600 mb-4" />
              <h2 className="text-lg sm:text-xl font-medium mb-2">Дело не найдено</h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                Запрашиваемое дело не существует или было удалено
              </p>
              <Button asChild size="sm" className="w-full sm:w-auto">
                <Link href="/cases">Вернуться к списку дел</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header currentPath="/document/:id" />
      <main className="flex-1 container py-4 sm:py-6">
        <div className="flex items-center gap-2 mb-4 sm:mb-6 flex-wrap">
          <Button variant="outline" size="sm" asChild className="min-w-[120px]">
            <Link href="/cases">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад к списку
            </Link>
          </Button>
          <div className="text-sm text-muted-foreground truncate">/ Дела / {caseData.title}</div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 truncate">{caseData.title}</h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              {getStatusBadge(caseData.status)}
              <div className="flex items-center gap-1 text-sm">
                <AlertTriangle className={`h-4 w-4 ${getRiskColor(caseData.risk)}`} />
                <span className={`${getRiskColor(caseData.risk)} font-medium`}>
                  {caseData.risk === "high" ? "Высокий" : caseData.risk === "medium" ? "Средний" : "Низкий"} риск
                </span>
              </div>
              {getDeadlineDisplay(caseData.deadline)}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:gap-6">
          <div className="w-full lg:w-2/3 space-y-4 sm:space-y-6">
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="flex w-full overflow-x-auto sm:grid sm:grid-cols-4 sm:overflow-visible">
                <TabsTrigger
                  value="overview"
                  className="flex-1 text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2 min-w-[80px]"
                  aria-label="Обзор дела"
                >
                  Обзор
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="flex-1 text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2 min-w-[80px]"
                  aria-label="Документы дела"
                >
                  Документы
                </TabsTrigger>
                <TabsTrigger
                  value="analysis"
                  className="flex-1 text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2 min-w-[80px]"
                  aria-label="Анализ ИИ"
                >
                  Анализ ИИ
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="flex-1 text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2 min-w-[80px]"
                  aria-label="История обработки"
                >
                  История
                </TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4 mt-4 sm:mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Основная информация</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {caseData.organizer && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-muted-foreground">Организатор</div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{caseData.organizer.name}</span>
                          </div>
                        </div>
                      )}
                      {caseData.details && caseData.details.dates && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-muted-foreground">Дата поездки</div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {formatDate(caseData.details.dates.start)} - {formatDate(caseData.details.dates.end)}
                            </span>
                          </div>
                        </div>
                      )}
                      {caseData.details && caseData.details.location && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-muted-foreground">Место назначения</div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{caseData.details.location}</span>
                          </div>
                        </div>
                      )}
                      {caseData.details && caseData.details.participants && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-muted-foreground">Количество участников</div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{caseData.details.participants} участников</span>
                          </div>
                        </div>
                      )}
                      {caseData.details && caseData.details.transport && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-muted-foreground">Транспорт</div>
                          <div className="flex items-center gap-2">
                            <Bus className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{caseData.details.transport}</span>
                          </div>
                        </div>
                      )}
                      {caseData.details && caseData.details.accommodation && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-muted-foreground">Проживание</div>
                          <div className="flex items-center gap-2">
                            <Home className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{caseData.details.accommodation}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {caseData.analysis && caseData.analysis.risks && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl">Оценка рисков</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {caseData.analysis.risks.safety !== undefined && (
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <Shield
                                  className={`h-4 w-4 ${
                                    caseData.analysis.risks.safety > 70
                                      ? "text-red-500"
                                      : caseData.analysis.risks.safety > 40
                                      ? "text-amber-500"
                                      : "text-green-500"
                                  }`}
                                />
                                <span className="font-medium text-sm sm:text-base">Безопасность</span>
                              </div>
                              <span
                                className={`text-xs sm:text-sm font-medium ${
                                  caseData.analysis.risks.safety > 70
                                    ? "text-red-500"
                                    : caseData.analysis.risks.safety > 40
                                    ? "text-amber-500"
                                    : "text-green-500"
                                }`}
                              >
                                {caseData.analysis.risks.safety > 70
                                  ? "Высокий риск"
                                  : caseData.analysis.risks.safety > 40
                                  ? "Средний риск"
                                  : "Низкий риск"}
                              </span>
                            </div>
                            <Progress
                              value={caseData.analysis.risks.safety}
                              className={`h-2 ${
                                caseData.analysis.risks.safety > 70
                                  ? "bg-red-100"
                                  : caseData.analysis.risks.safety > 40
                                  ? "bg-amber-100"
                                  : "bg-green-100"
                              }`}
                            >
                              <div
                                className={`h-full ${
                                  caseData.analysis.risks.safety > 70
                                    ? "bg-red-500"
                                    : caseData.analysis.risks.safety > 40
                                    ? "bg-amber-500"
                                    : "bg-green-500"
                                } rounded-full`}
                              />
                            </Progress>
                          </div>
                        )}
                        {caseData.analysis.risks.documentation !== undefined && (
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <FileCheck
                                  className={`h-4 w-4 ${
                                    caseData.analysis.risks.documentation > 70
                                      ? "text-red-500"
                                      : caseData.analysis.risks.documentation > 40
                                      ? "text-amber-500"
                                      : "text-green-500"
                                  }`}
                                />
                                <span className="font-medium text-sm sm:text-base">Документация</span>
                              </div>
                              <span
                                className={`text-xs sm:text-sm font-medium ${
                                  caseData.analysis.risks.documentation > 70
                                    ? "text-red-500"
                                    : caseData.analysis.risks.documentation > 40
                                    ? "text-amber-500"
                                    : "text-green-500"
                                }`}
                              >
                                {caseData.analysis.risks.documentation > 70
                                  ? "Высокий риск"
                                  : caseData.analysis.risks.documentation > 40
                                  ? "Средний риск"
                                  : "Низкий риск"}
                              </span>
                            </div>
                            <Progress
                              value={caseData.analysis.risks.documentation}
                              className={`h-2 ${
                                caseData.analysis.risks.documentation > 70
                                  ? "bg-red-100"
                                  : caseData.analysis.risks.documentation > 40
                                  ? "bg-amber-100"
                                  : "bg-green-100"
                              }`}
                            >
                              <div
                                className={`h-full ${
                                  caseData.analysis.risks.documentation > 70
                                    ? "bg-red-500"
                                    : caseData.analysis.risks.documentation > 40
                                    ? "bg-amber-500"
                                    : "bg-green-500"
                                } rounded-full`}
                              />
                            </Progress>
                          </div>
                        )}
                        {caseData.analysis.risks.supervision !== undefined && (
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <Users
                                  className={`h-4 w-4 ${
                                    caseData.analysis.risks.supervision > 70
                                      ? "text-red-500"
                                      : caseData.analysis.risks.supervision > 40
                                      ? "text-amber-500"
                                      : "text-green-500"
                                  }`}
                                />
                                <span className="font-medium text-sm sm:text-base">Сопровождение</span>
                              </div>
                              <span
                                className={`text-xs sm:text-sm font-medium ${
                                  caseData.analysis.risks.supervision > 70
                                    ? "text-red-500"
                                    : caseData.analysis.risks.supervision > 40
                                    ? "text-amber-500"
                                    : "text-green-500"
                                }`}
                              >
                                {caseData.analysis.risks.supervision > 70
                                  ? "Высокий риск"
                                  : caseData.analysis.risks.supervision > 40
                                  ? "Средний риск"
                                  : "Низкий риск"}
                              </span>
                            </div>
                            <Progress
                              value={caseData.analysis.risks.supervision}
                              className={`h-2 ${
                                caseData.analysis.risks.supervision > 70
                                  ? "bg-red-100"
                                  : caseData.analysis.risks.supervision > 40
                                  ? "bg-amber-100"
                                  : "bg-green-100"
                              }`}
                            >
                              <div
                                className={`h-full ${
                                  caseData.analysis.risks.supervision > 70
                                    ? "bg-red-500"
                                    : caseData.analysis.risks.supervision > 40
                                    ? "bg-amber-500"
                                    : "bg-green-500"
                                } rounded-full`}
                              />
                            </Progress>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {caseData.analysis && caseData.analysis.swot && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg sm:text-xl">SWOT-анализ</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                          <h3 className="font-medium text-green-700 mb-2 text-sm sm:text-base">Сильные стороны</h3>
                          <ul className="space-y-1 text-xs sm:text-sm">
                            {caseData.analysis.swot.strengths &&
                              caseData.analysis.swot.strengths.map((strength, index) => (
                                <li key={index}>• {strength}</li>
                              ))}
                          </ul>
                        </div>
                        <div className="bg-red-50 p-3 sm:p-4 rounded-lg">
                          <h3 className="font-medium text-red-700 mb-2 text-sm sm:text-base">Слабые стороны</h3>
                          <ul className="space-y-1 text-xs sm:text-sm">
                            {caseData.analysis.swot.weaknesses &&
                              caseData.analysis.swot.weaknesses.map((weakness, index) => (
                                <li key={index}>• {weakness}</li>
                              ))}
                          </ul>
                        </div>
                        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                          <h3 className="font-medium text-blue-700 mb-2 text-sm sm:text-base">Возможности</h3>
                          <ul className="space-y-1 text-xs sm:text-sm">
                            {caseData.analysis.swot.opportunities &&
                              caseData.analysis.swot.opportunities.map((opportunity, index) => (
                                <li key={index}>• {opportunity}</li>
                              ))}
                          </ul>
                        </div>
                        <div className="bg-amber-50 p-3 sm:p-4 rounded-lg">
                          <h3 className="font-medium text-amber-700 mb-2 text-sm sm:text-base">Угрозы</h3>
                          <ul className="space-y-1 text-xs sm:text-sm">
                            {caseData.analysis.swot.threats &&
                              caseData.analysis.swot.threats.map((threat, index) => (
                                <li key={index}>• {threat}</li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              <TabsContent value="documents" className="space-y-4 mt-4 sm:mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Загруженные документы</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {documents.length > 0 ? (
                        documents.map((doc) => (
                          <div
                            key={doc._id}
                            className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg ${
                              doc.status === "missing" ? "bg-red-50" : "hover:bg-muted/30"
                            }`}
                          >
                            <div className="flex items-center gap-3 mb-2 sm:mb-0">
                              {doc.status === "uploaded" ? (
                                <FileCheck className="h-5 w-5 text-emerald-600" />
                              ) : (
                                <FileWarning className="h-5 w-5 text-red-600" />
                              )}
                              <div>
                                <p className="font-medium text-sm sm:text-base">{doc.name}</p>
                                <p
                                  className={`text-xs sm:text-sm ${
                                    doc.status === "missing" ? "text-red-600" : "text-muted-foreground"
                                  }`}
                                >
                                  {doc.status === "uploaded"
                                    ? `${doc.type}, ${(doc.size / (1024 * 1024)).toFixed(1)} MB`
                                    : "Отсутствует"}
                                </p>
                              </div>
                            </div>
                            {doc.status === "uploaded" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full sm:w-auto min-w-[100px]"
                                onClick={() => handleViewDocument(doc)}
                                disabled={requestingDocument}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Просмотр
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full sm:w-auto min-w-[100px] border-red-200 text-red-600 hover:bg-red-50"
                                onClick={() => handleRequestDocument(doc.name)}
                                disabled={requestingDocument}
                              >
                                {requestingDocument ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Отправка...
                                  </>
                                ) : (
                                  "Запросить"
                                )}
                              </Button>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-sm sm:text-base text-muted-foreground">
                          Нет загруженных документов
                        </div>
                      )}

                      {caseData.analysis &&
                        caseData.analysis.missingDocuments &&
                        caseData.analysis.missingDocuments.length > 0 && (
                          <>
                            <div className="text-sm font-medium text-muted-foreground mt-6 mb-2">
                              Отсутствующие документы
                            </div>
                            {caseData.analysis.missingDocuments.map((docName, index) => (
                              <div
                                key={`missing-${index}`}
                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg bg-red-50"
                              >
                                <div className="flex items-center gap-3 mb-2 sm:mb-0">
                                  <FileWarning className="h-5 w-5 text-red-600" />
                                  <div>
                                    <p className="font-medium text-sm sm:text-base">{docName}</p>
                                    <p className="text-xs sm:text-sm text-red-600">Отсутствует</p>
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full sm:w-auto min-w-[100px] border-red-200 text-red-600 hover:bg-red-50"
                                  onClick={() => handleRequestDocument(docName)}
                                  disabled={requestingDocument}
                                >
                                  {requestingDocument ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Отправка...
                                    </>
                                  ) : (
                                    "Запросить"
                                  )}
                                </Button>
                              </div>
                            ))}
                          </>
                        )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="analysis" className="space-y-4 mt-4 sm:mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Результаты анализа ИИ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 sm:p-4 bg-amber-50 rounded-lg">
                        <h3 className="font-medium text-amber-800 mb-2 text-sm sm:text-base">Общее заключение</h3>
                        <p className="text-xs sm:text-sm">
                          {caseData.risk === "high"
                            ? "Система обнаружила несколько критических проблем, которые необходимо решить перед одобрением. Основные риски связаны с безопасностью участников и недостаточной документацией."
                            : caseData.risk === "medium"
                            ? "Система обнаружила несколько проблем, которые рекомендуется решить. Риски связаны с документацией и организацией мероприятия."
                            : "Система не обнаружила серьезных проблем. Рекомендуется проверить полноту документации перед окончательным одобрением."}
                        </p>
                      </div>
                      {caseData.analysis &&
                        caseData.analysis.missingDocuments &&
                        caseData.analysis.missingDocuments.length > 0 && (
                          <div className="space-y-2">
                            <h3 className="font-medium text-sm sm:text-base">Выявленные проблемы:</h3>
                            <div className="space-y-3">
                              {caseData.analysis.missingDocuments.map((doc, index) => (
                                <div key={index} className="flex items-start gap-2">
                                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                                  <div>
                                    <p className="font-medium text-sm sm:text-base">Отсутствует документ: {doc}</p>
                                    <p className="text-xs sm:text-sm text-muted-foreground">
                                      Необходимо запросить данный документ у организатора для полной оценки рисков.
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      {caseData.analysis &&
                        caseData.analysis.recommendations &&
                        caseData.analysis.recommendations.length > 0 && (
                          <div className="p-3 sm:p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-medium text-blue-800 mb-2 text-sm sm:text-base">Рекомендации</h3>
                            <ul className="space-y-2 text-xs sm:text-sm">
                              {caseData.analysis.recommendations.map((rec, index) => (
                                <li key={index}>• {rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="history" className="space-y-4 mt-4 sm:mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">История обработки</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {caseData.history && caseData.history.events && caseData.history.events.length > 0 ? (
                        caseData.history.events.map((event, index) => {
                          let icon, bgColor;

                          switch (event.type) {
                            case "created":
                              icon = <FileCheck className="h-5 w-5 text-emerald-600" />;
                              bgColor = "bg-emerald-100";
                              break;
                            case "ai_analysis":
                              icon = <AlertTriangle className="h-5 w-5 text-blue-600" />;
                              bgColor = "bg-blue-100";
                              break;
                            case "request_documents":
                            case "requested_revision":
                              icon = <MessageSquare className="h-5 w-5 text-amber-600" />;
                              bgColor = "bg-amber-100";
                              break;
                            case "response":
                              icon = <MessageSquare className="h-5 w-5 text-green-600" />;
                              bgColor = "bg-green-100";
                              break;
                            case "approved":
                              icon = <CheckCircle className="h-5 w-5 text-green-600" />;
                              bgColor = "bg-green-100";
                              break;
                            case "rejected":
                              icon = <ThumbsDown className="h-5 w-5 text-red-600" />;
                              bgColor = "bg-red-100";
                              break;
                            default:
                              icon = <FileCheck className="h-5 w-5 text-gray-600" />;
                              bgColor = "bg-gray-100";
                          }

                          return (
                            <div key={index} className="flex gap-4">
                              <div
                                className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center shrink-0`}
                              >
                                {icon}
                              </div>
                              <div className="space-y-1">
                                <p className="font-medium text-sm sm:text-base">
                                  {event.type === "created"
                                    ? "Дело создано"
                                    : event.type === "ai_analysis"
                                    ? "Анализ ИИ завершен"
                                    : event.type === "request_documents"
                                    ? "Запрос документов"
                                    : event.type === "requested_revision"
                                    ? "Запрошена доработка"
                                    : event.type === "response"
                                    ? "Ответ от организатора"
                                    : event.type === "approved"
                                    ? "Дело одобрено"
                                    : event.type === "rejected"
                                    ? "Дело отклонено"
                                    : event.type === "documents_uploaded"
                                    ? "Документы загружены"
                                    : event.type}
                                </p>
                                <p className="text-xs sm:text-sm text-muted-foreground">{event.description}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(event.timestamp).toLocaleString("ru-RU")}
                                  {event.user && ` • ${event.user}`}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-8 text-sm sm:text-base text-muted-foreground">
                          История событий отсутствует
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          <div className="w-full lg:w-1/3 space-y-4 sm:space-y-6 mt-4 lg:mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Принятие решения</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Button
                    className="bg-green-600 hover:bg-green-700 w-full text-sm sm:text-base"
                    onClick={() => handleMakeDecision("approve")}
                    disabled={processingDecision}
                  >
                    {processingDecision ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Обработка...
                      </>
                    ) : (
                      <>
                        <ThumbsUp className="mr-2 h-4 w-4" />
                        Одобрить
                      </>
                    )}
                  </Button>
                  <Button
                    className="bg-amber-600 hover:bg-amber-700 w-full text-sm sm:text-base"
                    onClick={() => handleMakeDecision("request")}
                    disabled={processingDecision}
                  >
                    {processingDecision ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Обработка...
                      </>
                    ) : (
                      <>
                        <Clock className="mr-2 h-4 w-4" />
                        Запросить доработку
                      </>
                    )}
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700 w-full text-sm sm:text-base"
                    onClick={() => handleMakeDecision("reject")}
                    disabled={processingDecision}
                  >
                    {processingDecision ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Обработка...
                      </>
                    ) : (
                      <>
                        <ThumbsDown className="mr-2 h-4 w-4" />
                        Отклонить
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {caseData.organizer && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Контактная информация</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Организатор</p>
                    <p className="text-sm sm:text-base">{caseData.organizer.name}</p>
                    {caseData.organizer.director && (
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Директор: {caseData.organizer.director}
                      </p>
                    )}
                  </div>
                  {caseData.organizer.contacts && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Контакты</p>
                      {caseData.organizer.contacts.phone && (
                        <p className="text-sm sm:text-base">{caseData.organizer.contacts.phone}</p>
                      )}
                      {caseData.organizer.contacts.email && (
                        <p className="text-sm sm:text-base">{caseData.organizer.contacts.email}</p>
                      )}
                    </div>
                  )}
                  <Button
                    variant="outline"
                    className="w-full text-sm sm:text-base"
                    onClick={() => {
                      Swal.fire({
                        title: "Связь с организатором",
                        input: "textarea",
                        inputLabel: "Сообщение",
                        inputPlaceholder: "Введите ваше сообщение...",
                        showCancelButton: true,
                        confirmButtonText: "Отправить",
                        cancelButtonText: "Отмена",
                        confirmButtonColor: "#10b981",
                        showLoaderOnConfirm: true,
                        preConfirm: (message) => {
                          return new Promise((resolve) => {
                            setTimeout(() => {
                              resolve();
                            }, 1500);
                          });
                        },
                      }).then((result) => {
                        if (result.isConfirmed) {
                          Swal.fire({
                            title: "Сообщение отправлено",
                            text: "Ваше сообщение успешно отправлено организатору",
                            icon: "success",
                            confirmButtonColor: "#10b981",
                          });
                        }
                      });
                    }}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Связаться с организатором
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Сроки</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Дата создания</p>
                    <p className="text-sm">{formatDate(caseData.createdAt)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Дедлайн для решения</p>
                    <p
                      className={`text-sm ${
                        new Date(caseData.deadline) < new Date() ? "text-red-500" : ""
                      } font-medium`}
                    >
                      {formatDate(caseData.deadline)}
                    </p>
                  </div>
                  {caseData.details && caseData.details.dates && (
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Дата мероприятия</p>
                      <p className="text-sm">{formatDate(caseData.details.dates.start)}</p>
                    </div>
                  )}
                </div>
                <div className="pt-2">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Осталось времени</span>
                    <span
                      className={`font-medium ${
                        new Date(caseData.deadline) < new Date() ? "text-red-500" : ""
                      }`}
                    >
                      {(() => {
                        const deadlineDate = new Date(caseData.deadline);
                        const today = new Date();
                        if (deadlineDate < today) {
                          return "Просрочено";
                        }
                        const diffTime = Math.abs(deadlineDate - today);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        return `${diffDays} ${diffDays === 1 ? "день" : diffDays < 5 ? "дня" : "дней"}`;
                      })()}
                    </span>
                  </div>
                  <Progress
                    value={(() => {
                      const deadlineDate = new Date(caseData.deadline);
                      const today = new Date();
                      if (deadlineDate < today) {
                        return 100;
                      }
                      const diffTime = Math.abs(deadlineDate - today);
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      return 100 - Math.min(100, (diffDays / 30) * 100);
                    })()}
                    className={`h-2 ${new Date(caseData.deadline) < new Date() ? "bg-red-100" : "bg-amber-100"}`}
                  >
                    <div
                      className={`h-full ${
                        new Date(caseData.deadline) < new Date() ? "bg-red-500" : "bg-amber-500"
                      } rounded-full`}
                    />
                  </Progress>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}