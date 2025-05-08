"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FileText,
  Download,
  BarChart3,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Swal from "sweetalert2"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { MobileMenu } from "@/components/mobile-menu"
import { Header } from "@/components/header"

// Данные для графиков
const casesProcessingData = [
  { name: "Неделя 1", high: 5, medium: 8, low: 4 },
  { name: "Неделя 2", high: 4, medium: 9, low: 6 },
  { name: "Неделя 3", high: 3, medium: 7, low: 9 },
  { name: "Неделя 4", high: 2, medium: 6, low: 11 },
]

const statusDistributionData = [
  { name: "Ожидает рассмотрения", value: 40, color: "#3b82f6" },
  { name: "На рассмотрении", value: 25, color: "#f59e0b" },
  { name: "Завершено", value: 35, color: "#10b981" },
]

const processingTrendsData = [
  { name: "Янв", processed: 15, time: 3.2, quality: 75 },
  { name: "Фев", processed: 20, time: 3.0, quality: 78 },
  { name: "Мар", processed: 25, time: 2.8, quality: 80 },
  { name: "Апр", processed: 30, time: 2.5, quality: 85 },
  { name: "Май", processed: 35, time: 2.2, quality: 88 },
  { name: "Июн", processed: 40, time: 2.0, quality: 90 },
]

const categoryProcessingTimeData = [
  { name: "Спортивные", time: 2.8, fill: "#3b82f6" },
  { name: "Образовательные", time: 1.9, fill: "#10b981" },
  { name: "Ремонт", time: 3.7, fill: "#f59e0b" },
  { name: "Закупки", time: 2.4, fill: "#8b5cf6" },
]

const userActivityData = [
  { name: "Пн", activity: 45, fill: "#10b981" },
  { name: "Вт", activity: 65, fill: "#10b981" },
  { name: "Ср", activity: 80, fill: "#10b981" },
  { name: "Чт", activity: 90, fill: "#10b981" },
  { name: "Пт", activity: 75, fill: "#10b981" },
  { name: "Сб", activity: 30, fill: "#10b981" },
  { name: "Вс", activity: 15, fill: "#10b981" },
]

const efficiencyByMonthData = [
  { name: "Янв", onTime: 70, speed: 65, quality: 60 },
  { name: "Фев", onTime: 75, speed: 68, quality: 65 },
  { name: "Мар", onTime: 78, speed: 72, quality: 70 },
  { name: "Апр", onTime: 82, speed: 75, quality: 75 },
  { name: "Май", onTime: 85, speed: 80, quality: 80 },
  { name: "Июн", onTime: 90, speed: 85, quality: 85 },
]

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState("month")
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Имитация загрузки данных
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    setLoading(true)

    // Имитация обновления данных
    setTimeout(() => {
      setLoading(false)
      setRefreshing(false)

      Swal.fire({
        title: "Данные обновлены",
        text: "Аналитика успешно обновлена",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      })
    }, 2000)
  }

  const handleExport = () => {
    Swal.fire({
      title: "Экспорт данных",
      text: "Выберите формат для экспорта аналитических данных",
      input: "select",
      inputOptions: {
        excel: "Excel (.xlsx)",
        pdf: "PDF",
        csv: "CSV",
      },
      inputPlaceholder: "Выберите формат",
      showCancelButton: true,
      confirmButtonText: "Экспортировать",
      cancelButtonText: "Отмена",
      confirmButtonColor: "#10b981",
      showLoaderOnConfirm: true,
      preConfirm: (format) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(format)
          }, 1500)
        })
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Экспорт завершен",
          text: `Данные успешно экспортированы в формате ${result.value.toUpperCase()}`,
          icon: "success",
          confirmButtonColor: "#10b981",
        })
      }
    })
  }

  const handlePeriodChange = (value) => {
    setPeriod(value)
    setLoading(true)

    // Имитация загрузки данных для нового периода
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header currentPath="/analytics" />
      <main className="flex-1 container py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Аналитика</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={period} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-[120px] sm:w-[180px] transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50">
                <SelectValue placeholder="Период" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Неделя</SelectItem>
                <SelectItem value="month">Месяц</SelectItem>
                <SelectItem value="quarter">Квартал</SelectItem>
                <SelectItem value="year">Год</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              className="transition-all duration-200 hover:bg-muted"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            </Button>
            <Button
              variant="outline"
              className="transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
              onClick={handleExport}
            >
              <Download className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Экспорт</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Всего дел</p>
                  {loading ? (
                    <div className="h-9 w-16 bg-muted animate-pulse rounded mt-1"></div>
                  ) : (
                    <div className="flex items-center gap-2 animate-fadeIn">
                      <p className="text-2xl sm:text-3xl font-bold">42</p>
                      <span className="text-xs sm:text-sm font-medium text-green-600 flex items-center">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        12%
                      </span>
                    </div>
                  )}
                </div>
                <div className="rounded-full bg-emerald-100 p-2 sm:p-3">
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-700" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Прогресс</span>
                  {loading ? (
                    <div className="h-4 w-8 bg-muted animate-pulse rounded"></div>
                  ) : (
                    <span className="font-medium animate-fadeIn">68%</span>
                  )}
                </div>
                {loading ? (
                  <div className="h-2 bg-muted animate-pulse rounded"></div>
                ) : (
                  <Progress value={68} className="h-2 transition-all duration-1000" />
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Требуют внимания</p>
                  {loading ? (
                    <div className="h-9 w-8 bg-muted animate-pulse rounded mt-1"></div>
                  ) : (
                    <div className="flex items-center gap-2 animate-fadeIn">
                      <p className="text-2xl sm:text-3xl font-bold">7</p>
                      <span className="text-xs sm:text-sm font-medium text-red-600 flex items-center">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        3%
                      </span>
                    </div>
                  )}
                </div>
                <div className="rounded-full bg-amber-100 p-2 sm:p-3">
                  <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-amber-700" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">От общего числа</span>
                  {loading ? (
                    <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
                  ) : (
                    <span className="font-medium text-amber-600 animate-fadeIn">16.7%</span>
                  )}
                </div>
                {loading ? (
                  <div className="h-2 bg-muted animate-pulse rounded"></div>
                ) : (
                  <Progress value={16.7} className="h-2 bg-amber-100 transition-all duration-1000">
                    <div className="h-full bg-amber-500 rounded-full" />
                  </Progress>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Среднее время обработки</p>
                  {loading ? (
                    <div className="h-9 w-16 bg-muted animate-pulse rounded mt-1"></div>
                  ) : (
                    <div className="flex items-center gap-2 animate-fadeIn">
                      <p className="text-2xl sm:text-3xl font-bold">2.4</p>
                      <span className="text-xs sm:text-sm font-medium text-green-600 flex items-center">
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                        8%
                      </span>
                    </div>
                  )}
                </div>
                <div className="rounded-full bg-blue-100 p-2 sm:p-3">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-700" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Дней на дело</span>
                  {loading ? (
                    <div className="h-4 w-8 bg-muted animate-pulse rounded"></div>
                  ) : (
                    <span className="font-medium animate-fadeIn">Улучшение</span>
                  )}
                </div>
                {loading ? (
                  <div className="h-2 bg-muted animate-pulse rounded"></div>
                ) : (
                  <Progress value={75} className="h-2 bg-blue-100 transition-all duration-1000">
                    <div className="h-full bg-blue-500 rounded-full" />
                  </Progress>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Завершено</p>
                  {loading ? (
                    <div className="h-9 w-8 bg-muted animate-pulse rounded mt-1"></div>
                  ) : (
                    <div className="flex items-center gap-2 animate-fadeIn">
                      <p className="text-2xl sm:text-3xl font-bold">18</p>
                      <span className="text-xs sm:text-sm font-medium text-green-600 flex items-center">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        15%
                      </span>
                    </div>
                  )}
                </div>
                <div className="rounded-full bg-green-100 p-2 sm:p-3">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-700" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">От общего числа</span>
                  {loading ? (
                    <div className="h-4 w-10 bg-muted animate-pulse rounded"></div>
                  ) : (
                    <span className="font-medium text-green-600 animate-fadeIn">42.8%</span>
                  )}
                </div>
                {loading ? (
                  <div className="h-2 bg-muted animate-pulse rounded"></div>
                ) : (
                  <Progress value={42.8} className="h-2 bg-green-100 transition-all duration-1000">
                    <div className="h-full bg-green-500 rounded-full" />
                  </Progress>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="overview" className="transition-all duration-200">
              Обзор
            </TabsTrigger>
            <TabsTrigger value="cases" className="transition-all duration-200">
              Дела
            </TabsTrigger>
            <TabsTrigger value="efficiency" className="transition-all duration-200">
              Эффективность
            </TabsTrigger>
            <TabsTrigger value="users" className="transition-all duration-200">
              Пользователи
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 animate-fadeIn">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                    <span>Динамика обработки дел</span>
                    <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  </CardTitle>
                  <CardDescription>Количество дел по статусам за период</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-[300px] bg-muted animate-pulse rounded"></div>
                  ) : (
                    <div className="h-[300px] animate-fadeIn">
                      <ResponsiveContainer width="99%" height="100%">
                        <BarChart data={casesProcessingData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12 }}
                            tickLine={false}
                            axisLine={{ stroke: "#e5e7eb" }}
                          />
                          <YAxis
                            tick={{ fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                          />
                          <Tooltip
                            formatter={(value, name) => {
                              const labels = {
                                high: "Высокий риск",
                                medium: "Средний риск",
                                low: "Низкий риск",
                              }
                              return [value, labels[name] || name]
                            }}
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "0.5rem",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                          />
                          <Legend
                            verticalAlign="bottom"
                            height={36}
                            formatter={(value) => {
                              const labels = {
                                high: "Высокий риск",
                                medium: "Средний риск",
                                low: "Низкий риск",
                              }
                              return <span className="text-xs sm:text-sm">{labels[value] || value}</span>
                            }}
                          />
                          <Bar dataKey="high" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="medium" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="low" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                    <span>Распределение по статусам</span>
                    <PieChart className="h-5 w-5 text-muted-foreground" />
                  </CardTitle>
                  <CardDescription>Текущее распределение дел по статусам</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-[300px] bg-muted animate-pulse rounded"></div>
                  ) : (
                    <div className="h-[300px] animate-fadeIn">
                      <ResponsiveContainer width="99%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={statusDistributionData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {statusDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value, name) => [`${value}%`, name]}
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "0.5rem",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                          />
                          <Legend
                            layout="vertical"
                            verticalAlign="middle"
                            align="right"
                            iconType="circle"
                            iconSize={8}
                            formatter={(value) => <span className="text-xs sm:text-sm">{value}</span>}
                          />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                  <span>Тренды обработки документов</span>
                  <LineChart className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
                <CardDescription>Динамика обработки документов за последние 6 месяцев</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-[300px] bg-muted animate-pulse rounded"></div>
                ) : (
                  <div className="h-[300px] animate-fadeIn">
                    <ResponsiveContainer width="99%" height="100%">
                      <RechartsLineChart
                        data={processingTrendsData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={{ stroke: "#e5e7eb" }}
                        />
                        <YAxis
                          yAxisId="left"
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}`}
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                          formatter={(value, name) => {
                            const labels = {
                              processed: "Обработано дел",
                              time: "Среднее время (дни)",
                              quality: "Качество анализа (%)",
                            }
                            return [value, labels[name] || name]
                          }}
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "0.5rem",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          iconType="line"
                          iconSize={10}
                          formatter={(value) => {
                            const labels = {
                              processed: "Обработано дел",
                              time: "Среднее время (дни)",
                              quality: "Качество анализа (%)",
                            }
                            return <span className="text-xs sm:text-sm">{labels[value] || value}</span>
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="processed"
                          yAxisId="left"
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={{ r: 4, fill: "#10b981" }}
                          activeDot={{ r: 6, fill: "#10b981" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="time"
                          yAxisId="left"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          dot={{ r: 4, fill: "#f59e0b" }}
                          activeDot={{ r: 6, fill: "#f59e0b" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="quality"
                          yAxisId="right"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ r: 4, fill: "#3b82f6" }}
                          activeDot={{ r: 6, fill: "#3b82f6" }}
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cases" className="space-y-6 animate-fadeIn">
            <Card className="transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Распределение дел по категориям</CardTitle>
                <CardDescription>Количество дел в каждой категории за выбранный период</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    <div className="h-16 bg-muted animate-pulse rounded"></div>
                    <div className="h-16 bg-muted animate-pulse rounded"></div>
                    <div className="h-16 bg-muted animate-pulse rounded"></div>
                    <div className="h-16 bg-muted animate-pulse rounded"></div>
                  </div>
                ) : (
                  <div className="space-y-4 animate-fadeIn">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Спортивные мероприятия</span>
                        </div>
                        <span className="text-sm font-medium">15 дел (35.7%)</span>
                      </div>
                      <Progress value={35.7} className="h-2 bg-blue-100 transition-all duration-1000">
                        <div className="h-full bg-blue-500 rounded-full" />
                      </Progress>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Образовательные экскурсии</span>
                        </div>
                        <span className="text-sm font-medium">12 дел (28.6%)</span>
                      </div>
                      <Progress value={28.6} className="h-2 bg-emerald-100 transition-all duration-1000">
                        <div className="h-full bg-emerald-500 rounded-full" />
                      </Progress>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Ремонт и обслуживание</span>
                        </div>
                        <span className="text-sm font-medium">8 дел (19%)</span>
                      </div>
                      <Progress value={19} className="h-2 bg-amber-100 transition-all duration-1000">
                        <div className="h-full bg-amber-500 rounded-full" />
                      </Progress>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Закупки</span>
                        </div>
                        <span className="text-sm font-medium">7 дел (16.7%)</span>
                      </div>
                      <Progress value={16.7} className="h-2 bg-purple-100 transition-all duration-1000">
                        <div className="h-full bg-purple-500 rounded-full" />
                      </Progress>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Топ-5 дел с высоким риском</CardTitle>
                  <CardDescription>Дела, требующие немедленного внимания</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <div key={i} className="h-12 bg-muted animate-pulse rounded"></div>
                        ))}
                    </div>
                  ) : (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                        <div>
                          <p className="font-medium text-sm sm:text-base">Поездка спортивной команды в город Б</p>
                          <div className="flex items-center gap-4 text-xs sm:text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-red-500" />
                              <span className="text-red-500">2 дня</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span className="text-red-500 font-medium text-xs sm:text-sm">Высокий</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                        <div>
                          <p className="font-medium text-sm sm:text-base">Ремонт кровли в школе №12</p>
                          <div className="flex items-center gap-4 text-xs sm:text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-red-500" />
                              <span className="text-red-500">3 дня</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span className="text-red-500 font-medium text-xs sm:text-sm">Высокий</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                        <div>
                          <p className="font-medium text-sm sm:text-base">Закупка оборудования для лаборатории</p>
                          <div className="flex items-center gap-4 text-xs sm:text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-red-500" />
                              <span className="text-red-500">4 дня</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span className="text-red-500 font-medium text-xs sm:text-sm">Высокий</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                        <div>
                          <p className="font-medium text-sm sm:text-base">Экскурсия в заповедник</p>
                          <div className="flex items-center gap-4 text-xs sm:text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-red-500" />
                              <span className="text-red-500">5 дней</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span className="text-red-500 font-medium text-xs sm:text-sm">Высокий</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                        <div>
                          <p className="font-medium text-sm sm:text-base">Соревнования по плаванию</p>
                          <div className="flex items-center gap-4 text-xs sm:text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-red-500" />
                              <span className="text-red-500">6 дней</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span className="text-red-500 font-medium text-xs sm:text-sm">Высокий</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Недавно завершенные дела</CardTitle>
                  <CardDescription>Дела, успешно обработанные за последнюю неделю</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <div key={i} className="h-12 bg-muted animate-pulse rounded"></div>
                        ))}
                    </div>
                  ) : (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                        <div>
                          <p className="font-medium text-sm sm:text-base">Закупка учебников для школ района</p>
                          <div className="flex items-center gap-4 text-xs sm:text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-green-500" />
                              <span className="text-green-500">Завершено вчера</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-green-500 font-medium text-xs sm:text-sm">Одобрено</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                        <div>
                          <p className="font-medium text-sm sm:text-base">Олимпиада по физике</p>
                          <div className="flex items-center gap-4 text-xs sm:text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-green-500" />
                              <span className="text-green-500">Завершено 2 дня назад</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-green-500 font-medium text-xs sm:text-sm">Одобрено</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                        <div>
                          <p className="font-medium text-sm sm:text-base">Экскурсия в планетарий</p>
                          <div className="flex items-center gap-4 text-xs sm:text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-green-500" />
                              <span className="text-green-500">Завершено 3 дня назад</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-green-500 font-medium text-xs sm:text-sm">Одобрено</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                        <div>
                          <p className="font-medium text-sm sm:text-base">Ремонт актового зала</p>
                          <div className="flex items-center gap-4 text-xs sm:text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-red-500" />
                              <span className="text-red-500">Завершено 4 дня назад</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span className="text-red-500 font-medium text-xs sm:text-sm">Отклонено</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                        <div>
                          <p className="font-medium text-sm sm:text-base">Конкурс молодых талантов</p>
                          <div className="flex items-center gap-4 text-xs sm:text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-green-500" />
                              <span className="text-green-500">Завершено 5 дней назад</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-green-500 font-medium text-xs sm:text-sm">Одобрено</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="efficiency" className="space-y-6 animate-fadeIn">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Среднее время обработки по категориям</CardTitle>
                  <CardDescription>Сравнение времени обработки дел разных категорий</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-[300px] bg-muted animate-pulse rounded"></div>
                  ) : (
                    <div className="h-[300px] animate-fadeIn">
                      <ResponsiveContainer width="99%" height="100%">
                        <BarChart
                          data={categoryProcessingTimeData}
                          layout="vertical"
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                          <XAxis type="number" domain={[0, 4]} tickFormatter={(value) => `${value} дн.`} />
                          <YAxis
                            dataKey="name"
                            type="category"
                            width={100}
                            tick={{ fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                          />
                          <Tooltip
                            formatter={(value) => [`${value} дней`, "Среднее время"]}
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "0.5rem",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                          />
                          <Legend
                            verticalAlign="top"
                            height={36}
                            content={() => (
                              <div className="text-center text-sm font-medium mb-2">
                                Среднее время обработки (в днях)
                              </div>
                            )}
                          />
                          <Bar dataKey="time" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Эффективность обработки документов</CardTitle>
                  <CardDescription>Процент дел, обработанных в срок</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="h-[300px] bg-muted animate-pulse rounded"></div>
                  ) : (
                    <div className="h-[300px] flex flex-col justify-center items-center animate-fadeIn">
                      <ResponsiveContainer width="99%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={[
                              { name: "В срок", value: 85, fill: "#10b981" },
                              { name: "С задержкой", value: 15, fill: "#e5e7eb" },
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                              const radius = innerRadius + (outerRadius - innerRadius) * 0.5
                              const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180))
                              const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180))
                              return (
                                <text
                                  x={x}
                                  y={y}
                                  fill="#10b981"
                                  textAnchor="middle"
                                  dominantBaseline="central"
                                  fontSize={24}
                                  fontWeight="bold"
                                >
                                  {`${(percent * 100).toFixed(0)}%`}
                                </text>
                              )
                            }}
                          />
                          <Tooltip
                            formatter={(value) => [`${value}%`, ""]}
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "0.5rem",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                          />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                      <div className="mt-4 space-y-2 text-center">
                        <p className="text-sm text-muted-foreground">85% дел обработаны в установленные сроки</p>
                        <p className="text-sm text-green-600 font-medium">+5% по сравнению с предыдущим периодом</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Динамика эффективности по месяцам</CardTitle>
                <CardDescription>Изменение ключевых показателей эффективности</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-[300px] bg-muted animate-pulse rounded"></div>
                ) : (
                  <div className="h-[300px] animate-fadeIn">
                    <ResponsiveContainer width="99%" height="100%">
                      <RechartsLineChart
                        data={efficiencyByMonthData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={{ stroke: "#e5e7eb" }}
                        />
                        <YAxis
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={false}
                          domain={[50, 100]}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                          formatter={(value, name) => {
                            const labels = {
                              onTime: "% дел в срок",
                              speed: "Скорость обработки",
                              quality: "Качество анализа",
                            }
                            return [value, labels[name] || name]
                          }}
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "0.5rem",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          iconType="line"
                          iconSize={10}
                          formatter={(value) => {
                            const labels = {
                              onTime: "% дел в срок",
                              speed: "Скорость обработки",
                              quality: "Качество анализа",
                            }
                            return <span className="text-xs sm:text-sm">{labels[value] || value}</span>
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="onTime"
                          stroke="#10b981"
                          strokeWidth={2}
                          dot={{ r: 4, fill: "#10b981" }}
                          activeDot={{ r: 6, fill: "#10b981" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="speed"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ r: 4, fill: "#3b82f6" }}
                          activeDot={{ r: 6, fill: "#3b82f6" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="quality"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          dot={{ r: 4, fill: "#f59e0b" }}
                          activeDot={{ r: 6, fill: "#f59e0b" }}
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6 animate-fadeIn">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="transition-all duration-300 hover:shadow-md">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Активных пользователей</p>
                      {loading ? (
                        <div className="h-9 w-8 bg-muted animate-pulse rounded mt-1"></div>
                      ) : (
                        <p className="text-2xl sm:text-3xl font-bold animate-fadeIn">24</p>
                      )}
                    </div>
                    <div className="rounded-full bg-blue-100 p-2 sm:p-3">
                      <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-700" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Рост</span>
                      {loading ? (
                        <div className="h-4 w-10 bg-muted animate-pulse rounded"></div>
                      ) : (
                        <span className="font-medium text-green-600 animate-fadeIn">+20%</span>
                      )}
                    </div>
                    {loading ? (
                      <div className="h-2 bg-muted animate-pulse rounded"></div>
                    ) : (
                      <Progress value={20} className="h-2 bg-blue-100 transition-all duration-1000">
                        <div className="h-full bg-blue-500 rounded-full" />
                      </Progress>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-md">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Среднее время сессии</p>
                      {loading ? (
                        <div className="h-9 w-16 bg-muted animate-pulse rounded mt-1"></div>
                      ) : (
                        <p className="text-2xl sm:text-3xl font-bold animate-fadeIn">18 мин</p>
                      )}
                    </div>
                    <div className="rounded-full bg-emerald-100 p-2 sm:p-3">
                      <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-700" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Изменение</span>
                      {loading ? (
                        <div className="h-4 w-10 bg-muted animate-pulse rounded"></div>
                      ) : (
                        <span className="font-medium text-green-600 animate-fadeIn">+12%</span>
                      )}
                    </div>
                    {loading ? (
                      <div className="h-2 bg-muted animate-pulse rounded"></div>
                    ) : (
                      <Progress value={12} className="h-2 bg-emerald-100 transition-all duration-1000">
                        <div className="h-full bg-emerald-500 rounded-full" />
                      </Progress>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-md">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Дел на пользователя</p>
                      {loading ? (
                        <div className="h-9 w-8 bg-muted animate-pulse rounded mt-1"></div>
                      ) : (
                        <p className="text-2xl sm:text-3xl font-bold animate-fadeIn">1.8</p>
                      )}
                    </div>
                    <div className="rounded-full bg-amber-100 p-2 sm:p-3">
                      <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-amber-700" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Эффективность</span>
                      {loading ? (
                        <div className="h-4 w-10 bg-muted animate-pulse rounded"></div>
                      ) : (
                        <span className="font-medium text-green-600 animate-fadeIn">+5%</span>
                      )}
                    </div>
                    {loading ? (
                      <div className="h-2 bg-muted animate-pulse rounded"></div>
                    ) : (
                      <Progress value={5} className="h-2 bg-amber-100 transition-all duration-1000">
                        <div className="h-full bg-amber-500 rounded-full" />
                      </Progress>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Активность пользователей</CardTitle>
                <CardDescription>Количество действий пользователей по дням недели</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-[300px] bg-muted animate-pulse rounded"></div>
                ) : (
                  <div className="h-[300px] animate-fadeIn">
                    <ResponsiveContainer width="99%" height="100%">
                      <BarChart data={userActivityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={{ stroke: "#e5e7eb" }}
                        />
                        <YAxis
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                          formatter={(value) => [`${value}%`, "Активность"]}
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "0.5rem",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Bar dataKey="activity" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Топ пользователей по эффективности</CardTitle>
                <CardDescription>Пользователи с наибольшим количеством обработанных дел</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="h-12 bg-muted animate-pulse rounded"></div>
                      ))}
                  </div>
                ) : (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-emerald-700">ИП</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm sm:text-base">Иван Петров</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">Руководитель</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm sm:text-base">12 дел</p>
                        <p className="text-xs sm:text-sm text-green-600">Эффективность: 95%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-emerald-700">АС</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm sm:text-base">Анна Смирнова</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">Секретарь</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm sm:text-base">10 дел</p>
                        <p className="text-xs sm:text-sm text-green-600">Эффективность: 92%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-emerald-700">МК</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm sm:text-base">Михаил Козлов</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">Администратор</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm sm:text-base">8 дел</p>
                        <p className="text-xs sm:text-sm text-green-600">Эффективность: 88%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-emerald-700">ЕИ</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm sm:text-base">Елена Иванова</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">Специалист</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm sm:text-base">7 дел</p>
                        <p className="text-xs sm:text-sm text-green-600">Эффективность: 85%</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-emerald-700">СП</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm sm:text-base">Сергей Попов</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">Аналитик</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm sm:text-base">5 дел</p>
                        <p className="text-xs sm:text-sm text-green-600">Эффективность: 80%</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
