"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, Shield, BarChart3, Clock, CheckCircle, Github, Mail, MessageSquare } from "lucide-react"
import Swal from "sweetalert2"
import { MobileMenu } from "@/components/mobile-menu"
import { Header } from "@/components/header"

export default function AboutPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Имитация загрузки данных
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  const handleContactClick = () => {
    Swal.fire({
      title: "Связаться с нами",
      html: `
        <div class="flex flex-col gap-4 text-left">
          <div>
            <label class="block text-sm font-medium mb-1">Ваше имя</label>
            <input type="text" id="name" class="w-full p-2 border rounded" placeholder="Введите ваше имя">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input type="email" id="email" class="w-full p-2 border rounded" placeholder="Введите ваше email">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Сообщение</label>
            <textarea id="message" class="w-full p-2 border rounded min-h-[100px]" placeholder="Введите ваше сообщение"></textarea>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Отправить",
      cancelButtonText: "Отмена",
      confirmButtonColor: "#10b981",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve()
          }, 1500)
        })
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Сообщение отправлено!",
          text: "Спасибо за ваше сообщение. Мы свяжемся с вами в ближайшее время.",
          icon: "success",
          confirmButtonColor: "#10b981",
        })
      }
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header currentPath="/about" />
      <main className="flex-1 container py-6">
        <div className="max-w-5xl mx-auto">
          <section className="mb-12">
            <div className="text-center mb-8 animate-fadeIn">
              <h1 className="text-4xl font-bold mb-4">О системе DocFlow</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Инновационная система автоматизации обработки документов для Департамента образования
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4 animate-fadeIn">
                <h2 className="text-2xl font-bold">Наша миссия</h2>
                <p className="text-muted-foreground">
                  DocFlow создана для оптимизации процесса принятия решений в образовательных учреждениях. Мы стремимся
                  сделать работу с документами быстрой, эффективной и безопасной, позволяя руководителям сосредоточиться
                  на стратегических задачах.
                </p>
                <p className="text-muted-foreground">
                  Наша система использует передовые технологии искусственного интеллекта для анализа документов,
                  выявления рисков и формирования рекомендаций, что значительно ускоряет процесс принятия решений и
                  минимизирует возможные ошибки.
                </p>
              </div>
              <div className="relative rounded-xl overflow-hidden shadow-xl animate-fadeIn">
                <div className="aspect-video bg-gradient-to-br from-emerald-500/20 to-emerald-700/40 backdrop-blur-sm flex items-center justify-center">
                  <div className="bg-white/90 p-6 rounded-lg shadow-lg max-w-xs">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                      <span className="font-medium">Автоматический анализ</span>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="h-5 w-5 text-emerald-600" />
                      <span className="font-medium">Оценка рисков</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-emerald-600" />
                      <span className="font-medium">Экономия времени</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Ключевые возможности</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {loading ? (
                Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="h-64">
                      <CardContent className="p-6">
                        <div className="h-10 w-10 rounded-full bg-muted animate-pulse mb-4"></div>
                        <div className="h-6 w-3/4 bg-muted animate-pulse mb-3"></div>
                        <div className="h-4 w-full bg-muted animate-pulse mb-2"></div>
                        <div className="h-4 w-full bg-muted animate-pulse mb-2"></div>
                        <div className="h-4 w-2/3 bg-muted animate-pulse"></div>
                      </CardContent>
                    </Card>
                  ))
              ) : (
                <>
                  <Card className="transition-all duration-300 hover:shadow-md animate-fadeIn">
                    <CardContent className="p-6">
                      <div className="rounded-full bg-emerald-100 p-3 w-fit mb-4">
                        <FileText className="h-6 w-6 text-emerald-700" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Умная обработка документов</h3>
                      <p className="text-muted-foreground">
                        Автоматическое извлечение ключевой информации из загруженных документов с помощью технологий
                        компьютерного зрения и обработки естественного языка.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="transition-all duration-300 hover:shadow-md animate-fadeIn">
                    <CardContent className="p-6">
                      <div className="rounded-full bg-emerald-100 p-3 w-fit mb-4">
                        <Shield className="h-6 w-6 text-emerald-700" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Оценка рисков</h3>
                      <p className="text-muted-foreground">
                        Автоматический анализ потенциальных рисков и формирование SWOT-анализа для каждого дела,
                        помогающий принимать взвешенные решения.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="transition-all duration-300 hover:shadow-md animate-fadeIn">
                    <CardContent className="p-6">
                      <div className="rounded-full bg-emerald-100 p-3 w-fit mb-4">
                        <Clock className="h-6 w-6 text-emerald-700" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Управление дедлайнами</h3>
                      <p className="text-muted-foreground">
                        Автоматическое определение приоритетов и дедлайнов для каждого дела, обеспечивающее
                        своевременное принятие решений.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="transition-all duration-300 hover:shadow-md animate-fadeIn">
                    <CardContent className="p-6">
                      <div className="rounded-full bg-emerald-100 p-3 w-fit mb-4">
                        <BarChart3 className="h-6 w-6 text-emerald-700" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Аналитика и отчеты</h3>
                      <p className="text-muted-foreground">
                        Подробная аналитика и статистика по всем делам, позволяющая отслеживать эффективность работы и
                        выявлять узкие места.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="transition-all duration-300 hover:shadow-md animate-fadeIn">
                    <CardContent className="p-6">
                      <div className="rounded-full bg-emerald-100 p-3 w-fit mb-4">
                        <MessageSquare className="h-6 w-6 text-emerald-700" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Автоматическая обратная связь</h3>
                      <p className="text-muted-foreground">
                        Система автоматически запрашивает недостающие документы и информацию, поддерживая постоянную
                        коммуникацию с заявителями.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="transition-all duration-300 hover:shadow-md animate-fadeIn">
                    <CardContent className="p-6">
                      <div className="rounded-full bg-emerald-100 p-3 w-fit mb-4">
                        <Users className="h-6 w-6 text-emerald-700" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Командная работа</h3>
                      <p className="text-muted-foreground">
                        Возможность совместной работы над документами, обсуждения и комментирования, что улучшает
                        качество принимаемых решений.
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Преимущества использования DocFlow</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="transition-all duration-300 hover:shadow-md animate-fadeIn">
                <CardHeader>
                  <CardTitle>Для руководителей</CardTitle>
                  <CardDescription>Принимайте решения быстрее и увереннее</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Экономия времени до 70%</p>
                      <p className="text-sm text-muted-foreground">
                        Автоматизация рутинных задач позволяет сосредоточиться на стратегических вопросах
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Снижение рисков на 85%</p>
                      <p className="text-sm text-muted-foreground">
                        Система выявляет потенциальные проблемы и предлагает решения
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Полная прозрачность процессов</p>
                      <p className="text-sm text-muted-foreground">
                        Отслеживание статуса каждого дела в режиме реального времени
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="transition-all duration-300 hover:shadow-md animate-fadeIn">
                <CardHeader>
                  <CardTitle>Для секретарей и администраторов</CardTitle>
                  <CardDescription>Упростите обработку документов</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Удобный интерфейс загрузки</p>
                      <p className="text-sm text-muted-foreground">
                        Простая загрузка документов через перетаскивание или выбор файлов
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Автоматическая проверка комплектности</p>
                      <p className="text-sm text-muted-foreground">
                        Система сама определяет, каких документов не хватает
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Шаблоны и автоматические ответы</p>
                      <p className="text-sm text-muted-foreground">
                        Готовые шаблоны для типовых ситуаций экономят время на коммуникацию
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Наша команда</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {loading ? (
                Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="text-center">
                      <CardContent className="p-6">
                        <div className="h-24 w-24 rounded-full bg-muted animate-pulse mx-auto mb-4"></div>
                        <div className="h-6 w-3/4 bg-muted animate-pulse mx-auto mb-2"></div>
                        <div className="h-4 w-1/2 bg-muted animate-pulse mx-auto mb-4"></div>
                        <div className="h-4 w-full bg-muted animate-pulse mb-2"></div>
                        <div className="h-4 w-full bg-muted animate-pulse"></div>
                      </CardContent>
                    </Card>
                  ))
              ) : (
                <>
                  <Card className="text-center transition-all duration-300 hover:shadow-md animate-fadeIn">
                    <CardContent className="p-6">
                      <div className="h-24 w-24 rounded-full bg-emerald-100 mx-auto mb-4 flex items-center justify-center">
                        <span className="text-2xl font-bold text-emerald-700">АК</span>
                      </div>
                      <h3 className="font-bold text-lg">Алексей Кузнецов</h3>
                      <p className="text-sm text-muted-foreground mb-4">Руководитель проекта</p>
                      <p className="text-sm text-muted-foreground">
                        Более 10 лет опыта в разработке систем автоматизации для государственных учреждений
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="text-center transition-all duration-300 hover:shadow-md animate-fadeIn">
                    <CardContent className="p-6">
                      <div className="h-24 w-24 rounded-full bg-emerald-100 mx-auto mb-4 flex items-center justify-center">
                        <span className="text-2xl font-bold text-emerald-700">ЕС</span>
                      </div>
                      <h3 className="font-bold text-lg">Елена Смирнова</h3>
                      <p className="text-sm text-muted-foreground mb-4">Ведущий разработчик</p>
                      <p className="text-sm text-muted-foreground">
                        Специалист по искусственному интеллекту и машинному обучению с опытом работы в крупных
                        IT-компаниях
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="text-center transition-all duration-300 hover:shadow-md animate-fadeIn">
                    <CardContent className="p-6">
                      <div className="h-24 w-24 rounded-full bg-emerald-100 mx-auto mb-4 flex items-center justify-center">
                        <span className="text-2xl font-bold text-emerald-700">МП</span>
                      </div>
                      <h3 className="font-bold text-lg">Михаил Петров</h3>
                      <p className="text-sm text-muted-foreground mb-4">UX/UI дизайнер</p>
                      <p className="text-sm text-muted-foreground">
                        Создает интуитивно понятные и удобные интерфейсы, ориентированные на пользователя
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="text-center transition-all duration-300 hover:shadow-md animate-fadeIn">
                    <CardContent className="p-6">
                      <div className="h-24 w-24 rounded-full bg-emerald-100 mx-auto mb-4 flex items-center justify-center">
                        <span className="text-2xl font-bold text-emerald-700">ОИ</span>
                      </div>
                      <h3 className="font-bold text-lg">Ольга Иванова</h3>
                      <p className="text-sm text-muted-foreground mb-4">Специалист по внедрению</p>
                      <p className="text-sm text-muted-foreground">
                        Помогает клиентам освоить систему и настроить ее под конкретные потребности организации
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </section>

          <section className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-6">Свяжитесь с нами</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Если у вас есть вопросы о системе DocFlow или вы хотите узнать больше о возможностях внедрения в вашей
              организации, свяжитесь с нами любым удобным способом.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 transition-all duration-200 hover:shadow-lg"
                onClick={handleContactClick}
              >
                <Mail className="mr-2 h-4 w-4" />
                Отправить сообщение
              </Button>
              <Button
                variant="outline"
                className="transition-all duration-200 hover:bg-muted"
                onClick={() => {
                  Swal.fire({
                    title: "Демонстрация системы",
                    text: "Оставьте свои контактные данные, и наш специалист свяжется с вами для организации демонстрации системы",
                    input: "email",
                    inputPlaceholder: "Введите ваш email",
                    showCancelButton: true,
                    confirmButtonText: "Запросить демо",
                    cancelButtonText: "Отмена",
                    confirmButtonColor: "#10b981",
                    showLoaderOnConfirm: true,
                    preConfirm: (email) => {
                      return new Promise((resolve) => {
                        setTimeout(() => {
                          resolve()
                        }, 1500)
                      })
                    },
                  }).then((result) => {
                    if (result.isConfirmed) {
                      Swal.fire({
                        title: "Запрос отправлен!",
                        text: "Наш специалист свяжется с вами в ближайшее время для организации демонстрации.",
                        icon: "success",
                        confirmButtonColor: "#10b981",
                      })
                    }
                  })
                }}
              >
                Запросить демо
              </Button>
              <Button
                variant="outline"
                className="transition-all duration-200 hover:bg-slate-100"
                onClick={() => {
                  window.open("https://github.com", "_blank")
                }}
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </div>
          </section>
        </div>
      </main>
      <footer className="border-t bg-muted/40">
        <div className="container py-8 text-center">
          <p className="text-sm text-muted-foreground">© 2025 DocFlow. Все права защищены.</p>
        </div>
      </footer>
    </div>
  )
}
