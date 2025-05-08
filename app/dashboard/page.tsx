"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, AlertTriangle, Clock, CheckCircle, Calendar, FileWarning, FileClock, FileCheck } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import Swal from "sweetalert2"
import { useRouter } from "next/navigation"
import { MobileMenu } from "@/components/mobile-menu"
import { Header } from "@/components/header"
import Cookies from "js-cookie"


export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("priority")
  const [cases, setCases] = useState([])
  const [stats, setStats] = useState({
    totalCases: 0,
    needAttention: 0,
    nextDeadline: 0,
    completed: 0,
  })

  useEffect(() => {
    
    // Fetch cases from API
    const fetchCases = async () => {
      const userId = await fetch("http://localhost:3000/api/auth/me", 
        {
          headers: {
            'Authorization': `Bearer ${Cookies.get("token")}`
          }
        }
      )

    const userData = await userId.json()  

    console.log("UserId", userData)
      try {
        const response = await fetch("/api/cases")
        if (!response.ok) {
          throw new Error("Failed to fetch cases")
        }

        const data = await response.json()
        setCases(data)

        // Calculate stats
        const totalCases = data.length
        const needAttention = data.filter((c) => c.risk === "high").length

        // Find next deadline
        const pendingCases = data.filter((c) => c.status !== "approved" && c.status !== "rejected")
        let nextDeadline = 0

        if (pendingCases.length > 0) {
          const today = new Date()
          const deadlines = pendingCases.map((c) => {
            const deadline = new Date(c.deadline)
            const diffTime = Math.abs(deadline - today)
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            return diffDays
          })

          nextDeadline = Math.min(...deadlines)
        }

        const completed = data.filter((c) => c.status === "approved").length

        setStats({
          totalCases,
          needAttention,
          nextDeadline,
          completed,
        })

        setLoading(false)
      } catch (error) {
        console.error("Error fetching cases:", error)
        setLoading(false)
      }
    }

    fetchCases()
  }, [])

  const handleNewCase = () => {
    Swal.fire({
      title: "Создание нового дела",
      text: "Вы хотите создать новое дело?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Да, создать",
      cancelButtonText: "Отмена",
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/upload")
      }
    })
  }

  const handleCaseClick = (id) => {
    router.push(`/document/${id}`)
  }

  // Filter cases based on active tab
  const getFilteredCases = () => {
    if (activeTab === "priority") {
      // Sort by risk (high to low)
      return [...cases]
        .filter((c) => c.risk === "high" || c.risk === "medium")
        .sort((a, b) => {
          const riskOrder = { high: 0, medium: 1, low: 2 }
          return riskOrder[a.risk] - riskOrder[b.risk]
        })
        .slice(0, 3)
    } else if (activeTab === "deadline") {
      // Sort by deadline (closest first)
      return [...cases]
        .filter((c) => c.status !== "approved" && c.status !== "rejected")
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, 3)
    } else if (activeTab === "recent") {
      // Sort by creation date (newest first)
      return [...cases].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3)
    }

    return []
  }

  const filteredCases = getFilteredCases()

  // Helper function to format deadline
  const formatDeadline = (deadlineDate) => {
    const today = new Date()
    const deadline = new Date(deadlineDate)
    const diffTime = Math.abs(deadline - today)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (deadline < today) {
      return "Просрочено"
    } else if (diffDays === 0) {
      return "Сегодня"
    } else if (diffDays === 1) {
      return "Завтра"
    } else {
      return `${diffDays} дней`
    }
  }

  // Helper function to get risk color
  const getRiskColor = (risk) => {
    switch (risk) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-amber-500"
      case "low":
        return "text-green-500"
      default:
        return "text-muted-foreground"
    }
  }

  // Helper function to get risk icon
  const getRiskIcon = (risk) => {
    return <AlertTriangle className={`h-4 w-4 ${getRiskColor(risk)} flex-shrink-0`} />
  }

  // Helper function to get risk text
  const getRiskText = (risk) => {
    switch (risk) {
      case "high":
        return "Высокий"
      case "medium":
        return "Средний"
      case "low":
        return "Низкий"
      default:
        return "Неизвестно"
    }
  }

  // Helper function to get border color based on risk
  const getBorderColor = (risk) => {
    switch (risk) {
      case "high":
        return "border-l-red-500"
      case "medium":
        return "border-l-amber-500"
      case "low":
        return "border-l-green-500"
      default:
        return "border-l-gray-500"
    }
  }

  

  return (
    <div className="flex min-h-screen flex-col">
      <Header currentPath="/dashboard" />
      <main className="flex-1 container py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Панель управления</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="transition-all duration-200 w-full sm:w-auto"
              onClick={() => {
                Swal.fire({
                  title: "Выбор периода",
                  html: `
            <div class="flex flex-col gap-4">
              <div>
                <label class="block text-sm font-medium mb-1">Начало периода</label>
                <input type="date" class="w-full p-2 border rounded" value="2025-05-01">
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Конец периода</label>
                <input type="date" class="w-full p-2 border rounded" value="2025-05-31">
              </div>
            </div>
          `,
                  showCancelButton: true,
                  confirmButtonText: "Применить",
                  cancelButtonText: "Отмена",
                  confirmButtonColor: "#10b981",
                })
              }}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Май 2025
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 transition-all duration-200 hover:shadow-lg w-full sm:w-auto"
              size="sm"
              onClick={handleNewCase}
            >
              <FileText className="mr-2 h-4 w-4" />
              Новое дело
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Всего дел</p>
                  {loading ? (
                    <div className="h-9 w-16 bg-muted animate-pulse rounded mt-1"></div>
                  ) : (
                    <p className="text-3xl font-bold animate-fadeIn">{stats.totalCases}</p>
                  )}
                </div>
                <div className="rounded-full bg-emerald-100 p-3">
                  <FileText className="h-6 w-6 text-emerald-700" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Прогресс</span>
                  {loading ? (
                    <div className="h-4 w-8 bg-muted animate-pulse rounded"></div>
                  ) : (
                    <span className="font-medium animate-fadeIn">
                      {Math.round((stats.completed / stats.totalCases) * 100) || 0}%
                    </span>
                  )}
                </div>
                {loading ? (
                  <div className="h-2 bg-muted animate-pulse rounded"></div>
                ) : (
                  <Progress
                    value={Math.round((stats.completed / stats.totalCases) * 100) || 0}
                    className="h-2 transition-all duration-1000"
                  />
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Требуют внимания</p>
                  {loading ? (
                    <div className="h-9 w-8 bg-muted animate-pulse rounded mt-1"></div>
                  ) : (
                    <p className="text-3xl font-bold animate-fadeIn">{stats.needAttention}</p>
                  )}
                </div>
                <div className="rounded-full bg-amber-100 p-3">
                  <AlertTriangle className="h-6 w-6 text-amber-700" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Критичность</span>
                  {loading ? (
                    <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
                  ) : (
                    <span className="font-medium text-amber-600 animate-fadeIn">
                      {stats.needAttention > 0 ? "Высокая" : "Низкая"}
                    </span>
                  )}
                </div>
                {loading ? (
                  <div className="h-2 bg-muted animate-pulse rounded"></div>
                ) : (
                  <Progress
                    value={stats.needAttention > 0 ? 75 : 25}
                    className="h-2 bg-amber-100 transition-all duration-1000"
                  >
                    <div className="h-full bg-amber-500 rounded-full" />
                  </Progress>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ближайший дедлайн</p>
                  {loading ? (
                    <div className="h-9 w-16 bg-muted animate-pulse rounded mt-1"></div>
                  ) : (
                    <p className="text-3xl font-bold animate-fadeIn">
                      {stats.nextDeadline} {stats.nextDeadline === 1 ? "день" : "дня"}
                    </p>
                  )}
                </div>
                <div className="rounded-full bg-blue-100 p-3">
                  <Clock className="h-6 w-6 text-blue-700" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Готовность</span>
                  {loading ? (
                    <div className="h-4 w-8 bg-muted animate-pulse rounded"></div>
                  ) : (
                    <span className="font-medium animate-fadeIn">45%</span>
                  )}
                </div>
                {loading ? (
                  <div className="h-2 bg-muted animate-pulse rounded"></div>
                ) : (
                  <Progress value={45} className="h-2 bg-blue-100 transition-all duration-1000">
                    <div className="h-full bg-blue-500 rounded-full" />
                  </Progress>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Завершено</p>
                  {loading ? (
                    <div className="h-9 w-8 bg-muted animate-pulse rounded mt-1"></div>
                  ) : (
                    <p className="text-3xl font-bold animate-fadeIn">{stats.completed}</p>
                  )}
                </div>
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle className="h-6 w-6 text-green-700" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">За этот месяц</span>
                  {loading ? (
                    <div className="h-4 w-10 bg-muted animate-pulse rounded"></div>
                  ) : (
                    <span className="font-medium text-green-600 animate-fadeIn">+12%</span>
                  )}
                </div>
                {loading ? (
                  <div className="h-2 bg-muted animate-pulse rounded"></div>
                ) : (
                  <Progress value={100} className="h-2 bg-green-100 transition-all duration-1000">
                    <div className="h-full bg-green-500 rounded-full" />
                  </Progress>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="priority" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="priority" className="transition-all duration-200">
              По приоритету
            </TabsTrigger>
            <TabsTrigger value="deadline" className="transition-all duration-200">
              По дедлайну
            </TabsTrigger>
            <TabsTrigger value="recent" className="transition-all duration-200">
              Недавние
            </TabsTrigger>
          </TabsList>
          <TabsContent value="priority" className="space-y-4 animate-fadeIn overflow-hidden">
            <h2 className="text-xl font-bold mb-4">Дела, требующие внимания</h2>
            <div className="grid gap-4">
              {loading ? (
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="border-l-4 border-l-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="w-full">
                            <div className="h-6 w-3/4 bg-muted animate-pulse rounded mb-2"></div>
                            <div className="h-4 w-full bg-muted animate-pulse rounded mb-2"></div>
                            <div className="h-4 w-1/2 bg-muted animate-pulse rounded"></div>
                          </div>
                          <div className="flex gap-2">
                            <div className="h-9 w-16 bg-muted animate-pulse rounded"></div>
                            <div className="h-9 w-24 bg-muted animate-pulse rounded"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              ) : filteredCases.length > 0 ? (
                filteredCases.map((caseItem) => (
                  <Card
                    key={caseItem._id}
                    className={`border-l-4 ${getBorderColor(caseItem.risk)} transition-all duration-200 hover:shadow-md cursor-pointer`}
                    onClick={() => handleCaseClick(caseItem._id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {getRiskIcon(caseItem.risk)}
                            <h3 className="font-semibold truncate">{caseItem.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{caseItem.description}</p>
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Clock
                                className={`h-3 w-3 ${
                                  new Date(caseItem.deadline) < new Date() ? "text-red-500" : "text-muted-foreground"
                                } flex-shrink-0`}
                              />
                              <span
                                className={
                                  new Date(caseItem.deadline) < new Date() ? "text-red-500" : "text-muted-foreground"
                                }
                              >
                                Дедлайн: {formatDeadline(caseItem.deadline)}
                              </span>
                            </div>
                            {caseItem.analysis && caseItem.analysis.missingDocuments && (
                              <div className="flex items-center gap-1">
                                <FileWarning className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                <span className="text-muted-foreground">
                                  Отсутствуют {caseItem.analysis.missingDocuments.length} документа
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 self-start mt-2 md:mt-0">
                          <Button
                            variant="outline"
                            size="sm"
                            className="transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCaseClick(caseItem._id)
                            }}
                          >
                            Детали
                          </Button>
                          <Button
                            className="bg-emerald-600 hover:bg-emerald-700 transition-all duration-200 hover:shadow-lg"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCaseClick(caseItem._id)
                            }}
                          >
                            Рассмотреть
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">Нет дел, требующих внимания</div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="deadline" className="space-y-4 animate-fadeIn overflow-hidden">
            <h2 className="text-xl font-bold mb-4">Ближайшие дедлайны</h2>
            <div className="grid gap-4">
              {loading ? (
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="border-l-4 border-l-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="w-full">
                            <div className="h-6 w-3/4 bg-muted animate-pulse rounded mb-2"></div>
                            <div className="h-4 w-full bg-muted animate-pulse rounded mb-2"></div>
                            <div className="h-4 w-1/2 bg-muted animate-pulse rounded"></div>
                          </div>
                          <div className="flex gap-2">
                            <div className="h-9 w-16 bg-muted animate-pulse rounded"></div>
                            <div className="h-9 w-24 bg-muted animate-pulse rounded"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              ) : filteredCases.length > 0 ? (
                filteredCases.map((caseItem) => (
                  <Card
                    key={caseItem._id}
                    className={`border-l-4 ${
                      new Date(caseItem.deadline) < new Date()
                        ? "border-l-red-500"
                        : new Date(caseItem.deadline) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                          ? "border-l-amber-500"
                          : "border-l-blue-500"
                    } transition-all duration-200 hover:shadow-md cursor-pointer`}
                    onClick={() => handleCaseClick(caseItem._id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <FileClock
                              className={`h-4 w-4 ${
                                new Date(caseItem.deadline) < new Date()
                                  ? "text-red-500"
                                  : new Date(caseItem.deadline) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                                    ? "text-amber-500"
                                    : "text-blue-500"
                              } flex-shrink-0`}
                            />
                            <h3 className="font-semibold truncate">{caseItem.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{caseItem.description}</p>
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Clock
                                className={`h-3 w-3 ${
                                  new Date(caseItem.deadline) < new Date()
                                    ? "text-red-500"
                                    : new Date(caseItem.deadline) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                                      ? "text-amber-500"
                                      : "text-blue-500"
                                } flex-shrink-0`}
                              />
                              <span
                                className={
                                  new Date(caseItem.deadline) < new Date()
                                    ? "text-red-500"
                                    : new Date(caseItem.deadline) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                                      ? "text-amber-500"
                                      : "text-blue-500"
                                }
                              >
                                Дедлайн: {formatDeadline(caseItem.deadline)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <AlertTriangle className={`h-3 w-3 ${getRiskColor(caseItem.risk)} flex-shrink-0`} />
                              <span className={getRiskColor(caseItem.risk)}>{getRiskText(caseItem.risk)} риск</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 self-start mt-2 md:mt-0">
                          <Button
                            variant="outline"
                            size="sm"
                            className="transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCaseClick(caseItem._id)
                            }}
                          >
                            Детали
                          </Button>
                          <Button
                            className="bg-emerald-600 hover:bg-emerald-700 transition-all duration-200 hover:shadow-lg"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCaseClick(caseItem._id)
                            }}
                          >
                            Рассмотреть
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">Нет дел с ближайшими дедлайнами</div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="recent" className="space-y-4 animate-fadeIn overflow-hidden">
            <h2 className="text-xl font-bold mb-4">Недавно добавленные</h2>
            <div className="grid gap-4">
              {loading ? (
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="border-l-4 border-l-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="w-full">
                            <div className="h-6 w-3/4 bg-muted animate-pulse rounded mb-2"></div>
                            <div className="h-4 w-full bg-muted animate-pulse rounded mb-2"></div>
                            <div className="h-4 w-1/2 bg-muted animate-pulse rounded"></div>
                          </div>
                          <div className="flex gap-2">
                            <div className="h-9 w-16 bg-muted animate-pulse rounded"></div>
                            <div className="h-9 w-24 bg-muted animate-pulse rounded"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              ) : filteredCases.length > 0 ? (
                filteredCases.map((caseItem) => (
                  <Card
                    key={caseItem._id}
                    className={`border-l-4 ${getBorderColor(caseItem.risk)} transition-all duration-200 hover:shadow-md cursor-pointer`}
                    onClick={() => handleCaseClick(caseItem._id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <FileCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <h3 className="font-semibold truncate">{caseItem.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{caseItem.description}</p>
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                              <span className="text-muted-foreground">
                                Добавлено: {new Date(caseItem.createdAt).toLocaleDateString("ru-RU")}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <AlertTriangle className={`h-3 w-3 ${getRiskColor(caseItem.risk)} flex-shrink-0`} />
                              <span className={getRiskColor(caseItem.risk)}>{getRiskText(caseItem.risk)} риск</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 self-start mt-2 md:mt-0">
                          <Button
                            variant="outline"
                            size="sm"
                            className="transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCaseClick(caseItem._id)
                            }}
                          >
                            Детали
                          </Button>
                          <Button
                            className="bg-emerald-600 hover:bg-emerald-700 transition-all duration-200 hover:shadow-lg"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCaseClick(caseItem._id)
                            }}
                          >
                            Рассмотреть
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">Нет недавно добавленных дел</div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid gap-6 md:grid-cols-2 overflow-hidden">
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle>Статистика обработки документов</CardTitle>
              <CardDescription>Эффективность обработки за последний месяц</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-[200px] bg-muted animate-pulse rounded"></div>
              ) : (
                <div className="h-[200px] flex items-end justify-between gap-1 sm:gap-2 animate-fadeIn">
                  <div className="relative h-full flex flex-col justify-end">
                    <div className="bg-emerald-100 w-8 sm:w-12 h-[65%] rounded-t-md transition-all duration-1000 hover:bg-emerald-200"></div>
                    <div className="absolute bottom-0 w-full text-center text-[10px] sm:text-xs mt-1">Пн</div>
                  </div>
                  <div className="relative h-full flex flex-col justify-end">
                    <div className="bg-emerald-200 w-8 sm:w-12 h-[80%] rounded-t-md transition-all duration-1000 hover:bg-emerald-300"></div>
                    <div className="absolute bottom-0 w-full text-center text-[10px] sm:text-xs mt-1">Вт</div>
                  </div>
                  <div className="relative h-full flex flex-col justify-end">
                    <div className="bg-emerald-300 w-8 sm:w-12 h-[60%] rounded-t-md transition-all duration-1000 hover:bg-emerald-400"></div>
                    <div className="absolute bottom-0 w-full text-center text-[10px] sm:text-xs mt-1">Ср</div>
                  </div>
                  <div className="relative h-full flex flex-col justify-end">
                    <div className="bg-emerald-400 w-8 sm:w-12 h-[90%] rounded-t-md transition-all duration-1000 hover:bg-emerald-500"></div>
                    <div className="absolute bottom-0 w-full text-center text-[10px] sm:text-xs mt-1">Чт</div>
                  </div>
                  <div className="relative h-full flex flex-col justify-end">
                    <div className="bg-emerald-500 w-8 sm:w-12 h-[75%] rounded-t-md transition-all duration-1000 hover:bg-emerald-600"></div>
                    <div className="absolute bottom-0 w-full text-center text-[10px] sm:text-xs mt-1">Пт</div>
                  </div>
                  <div className="relative h-full flex flex-col justify-end">
                    <div className="bg-emerald-600 w-8 sm:w-12 h-[40%] rounded-t-md transition-all duration-1000 hover:bg-emerald-700"></div>
                    <div className="absolute bottom-0 w-full text-center text-[10px] sm:text-xs mt-1">Сб</div>
                  </div>
                  <div className="relative h-full flex flex-col justify-end">
                    <div className="bg-emerald-700 w-8 sm:w-12 h-[20%] rounded-t-md transition-all duration-1000 hover:bg-emerald-800"></div>
                    <div className="absolute bottom-0 w-full text-center text-[10px] sm:text-xs mt-1">Вс</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle>Распределение рисков</CardTitle>
              <CardDescription>Текущее распределение дел по уровню риска</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <div className="h-16 bg-muted animate-pulse rounded"></div>
                  <div className="h-16 bg-muted animate-pulse rounded"></div>
                  <div className="h-16 bg-muted animate-pulse rounded"></div>
                </div>
              ) : (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-sm">Высокий риск</span>
                      </div>
                      <span className="text-sm font-medium">{cases.filter((c) => c.risk === "high").length} дел</span>
                    </div>
                    <Progress
                      value={
                        cases.length > 0 ? (cases.filter((c) => c.risk === "high").length / cases.length) * 100 : 0
                      }
                      className="h-2 bg-red-100 transition-all duration-1000"
                    >
                      <div className="h-full bg-red-500 rounded-full" />
                    </Progress>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span className="text-sm">Средний риск</span>
                      </div>
                      <span className="text-sm font-medium">{cases.filter((c) => c.risk === "medium").length} дел</span>
                    </div>
                    <Progress
                      value={
                        cases.length > 0 ? (cases.filter((c) => c.risk === "medium").length / cases.length) * 100 : 0
                      }
                      className="h-2 bg-amber-100 transition-all duration-1000"
                    >
                      <div className="h-full bg-amber-500 rounded-full" />
                    </Progress>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm">Низкий риск</span>
                      </div>
                      <span className="text-sm font-medium">{cases.filter((c) => c.risk === "low").length} дел</span>
                    </div>
                    <Progress
                      value={cases.length > 0 ? (cases.filter((c) => c.risk === "low").length / cases.length) * 100 : 0}
                      className="h-2 bg-green-100 transition-all duration-1000"
                    >
                      <div className="h-full bg-green-500 rounded-full" />
                    </Progress>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

