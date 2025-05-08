import { connectToDatabase } from "../lib/mongodb"
import Case from "../models/Case"
import Document from "../models/Document"
import User from "../models/User"

async function seedDatabase() {
  try {
    await connectToDatabase()

    // Clear existing data
    await Case.deleteMany({})
    await Document.deleteMany({})
    await User.deleteMany({})

    // Create users
    const users = await User.insertMany([
      {
        name: "Иван Петров",
        email: "ivan@example.com",
        role: "admin",
        avatar: "/avatars/ivan.jpg",
      },
      {
        name: "Анна Смирнова",
        email: "anna@example.com",
        role: "secretary",
        avatar: "/avatars/anna.jpg",
      },
      {
        name: "Михаил Козлов",
        email: "mikhail@example.com",
        role: "manager",
        avatar: "/avatars/mikhail.jpg",
      },
    ])

    // Create cases
    const cases = await Case.insertMany([
      {
        title: "Поездка спортивной команды в город Б",
        description:
          "Требуется подписать разрешение на поездку команды из 1000+ спортсменов в город Б для участия в соревнованиях.",
        status: "review",
        risk: "high",
        deadline: new Date("2025-05-23"),
        createdAt: new Date("2025-05-20"),
        updatedAt: new Date("2025-05-20"),
        documents: [],
        analysis: {
          swot: {
            strengths: [
              "Официальное приглашение от принимающей стороны",
              "Опыт организации подобных мероприятий",
              "Лицензированные транспортные средства",
              "Проверенное место проживания",
            ],
            weaknesses: [
              "Недостаточное количество сопровождающих",
              "Отсутствие полного комплекта документов",
              "Большое количество участников",
              "Длительное время в пути",
            ],
            opportunities: [
              "Повышение спортивного мастерства",
              "Укрепление межрегиональных связей",
              "Возможность получения наград и признания",
              "Опыт участия в крупных соревнованиях",
            ],
            threats: [
              "Риски безопасности при транспортировке",
              "Возможные проблемы со здоровьем участников",
              "Недостаточный контроль за большой группой",
              "Юридические риски из-за неполной документации",
            ],
          },
          risks: {
            safety: 80,
            documentation: 50,
            supervision: 75,
          },
          missingDocuments: ["Медицинские справки участников", "Согласия родителей", "Страховые полисы участников"],
          recommendations: [
            "Увеличить количество сопровождающих до соотношения 1:10",
            "Запросить и получить все отсутствующие документы",
            "Разработать детальный план остановок во время поездки",
            "Обеспечить наличие медицинского работника в каждом автобусе",
            "Провести дополнительный инструктаж по безопасности для всех участников",
          ],
        },
        organizer: {
          name: 'Спортивная школа "Олимп"',
          director: "Петров Сергей Иванович",
          contacts: {
            phone: "+7 (495) 123-45-67",
            email: "info@olimp-sport.ru",
          },
        },
        details: {
          location: 'Город Б, Спортивный комплекс "Арена"',
          participants: 1080,
          transport: "20 автобусов, лицензированных для перевозки детей",
          accommodation: 'Гостиница "Спорт", 3 звезды',
          dates: {
            start: new Date("2025-06-25"),
            end: new Date("2025-06-30"),
          },
        },
        history: {
          events: [
            {
              type: "created",
              description: "Дело создано",
              timestamp: new Date("2025-05-20T10:23:00"),
              user: "Анна Смирнова",
            },
            {
              type: "ai_analysis",
              description: "Система выявила 3 критических проблемы и 2 предупреждения",
              timestamp: new Date("2025-05-20T10:25:00"),
              user: "Система",
            },
            {
              type: "request_documents",
              description: "Секретарь отправил запрос организатору на предоставление недостающих документов",
              timestamp: new Date("2025-05-20T11:15:00"),
              user: "Анна Смирнова",
            },
            {
              type: "response",
              description: "Организатор обещал предоставить недостающие документы в течение 24 часов",
              timestamp: new Date("2025-05-21T09:30:00"),
              user: "Система",
            },
          ],
        },
      },
      {
        title: "Экскурсия школы №15 в музей",
        description: "Запрос на организацию экскурсии для 120 учеников начальной школы",
        status: "review",
        risk: "medium",
        deadline: new Date("2025-05-28"),
        createdAt: new Date("2025-05-19"),
        updatedAt: new Date("2025-05-19"),
        documents: [],
        analysis: {
          swot: {
            strengths: [
              "Официальное приглашение от музея",
              "Небольшое расстояние до места проведения",
              "Опытные сопровождающие",
              "Образовательная ценность",
            ],
            weaknesses: [
              "Отсутствие некоторых документов",
              "Большое количество детей младшего возраста",
              "Ограниченное время на экскурсию",
            ],
            opportunities: [
              "Расширение кругозора учеников",
              "Практическое закрепление учебного материала",
              "Развитие культурных интересов",
            ],
            threats: [
              "Риски при транспортировке детей",
              "Возможность потери контроля над группой в общественном месте",
              "Непредвиденные обстоятельства",
            ],
          },
          risks: {
            safety: 45,
            documentation: 60,
            supervision: 40,
          },
          missingDocuments: ["Согласия родителей некоторых учеников", "Страховые полисы"],
          recommendations: [
            "Получить все необходимые согласия родителей",
            "Обеспечить дополнительных сопровождающих",
            "Разработать четкий план действий в экстренных ситуациях",
            "Провести инструктаж по безопасности перед поездкой",
          ],
        },
        organizer: {
          name: "Школа №15",
          director: "Иванова Елена Петровна",
          contacts: {
            phone: "+7 (495) 987-65-43",
            email: "school15@example.com",
          },
        },
        details: {
          location: "Исторический музей города",
          participants: 120,
          transport: "3 школьных автобуса",
          accommodation: "Не требуется",
          dates: {
            start: new Date("2025-06-10"),
            end: new Date("2025-06-10"),
          },
        },
        history: {
          events: [
            {
              type: "created",
              description: "Дело создано",
              timestamp: new Date("2025-05-19T14:30:00"),
              user: "Анна Смирнова",
            },
            {
              type: "ai_analysis",
              description: "Система выявила 1 проблему и 2 предупреждения",
              timestamp: new Date("2025-05-19T14:32:00"),
              user: "Система",
            },
          ],
        },
      },
      {
        title: "Летний лагерь для одаренных детей",
        description: "Организация летнего лагеря для 200 одаренных детей на базе отдыха",
        status: "review",
        risk: "medium",
        deadline: new Date("2025-05-30"),
        createdAt: new Date("2025-05-18"),
        updatedAt: new Date("2025-05-18"),
        documents: [],
        analysis: {
          swot: {
            strengths: [
              "Профессиональные педагоги и тренеры",
              "Хорошо оборудованная база отдыха",
              "Разнообразная программа мероприятий",
              "Опыт проведения подобных мероприятий",
            ],
            weaknesses: [
              "Длительный период проживания детей вне дома",
              "Отсутствие некоторых документов",
              "Удаленность от города",
            ],
            opportunities: [
              "Развитие талантов и способностей детей",
              "Формирование новых навыков и компетенций",
              "Социализация и командная работа",
              "Профессиональная ориентация",
            ],
            threats: [
              "Погодные условия",
              "Риски для здоровья при длительном пребывании",
              "Психологические трудности адаптации некоторых детей",
              "Транспортные риски",
            ],
          },
          risks: {
            safety: 50,
            documentation: 40,
            supervision: 30,
          },
          missingDocuments: ["Медицинские справки некоторых участников"],
          recommendations: [
            "Собрать все медицинские справки",
            "Обеспечить постоянное медицинское сопровождение",
            "Разработать план эвакуации в случае ЧС",
            "Провести инструктаж по безопасности для всех участников и персонала",
          ],
        },
        organizer: {
          name: "Центр развития одаренных детей",
          director: "Сидоров Алексей Николаевич",
          contacts: {
            phone: "+7 (495) 111-22-33",
            email: "gifted@example.com",
          },
        },
        details: {
          location: 'База отдыха "Сосновый бор"',
          participants: 200,
          transport: "5 автобусов",
          accommodation: "Комфортабельные коттеджи",
          dates: {
            start: new Date("2025-07-01"),
            end: new Date("2025-07-21"),
          },
        },
        history: {
          events: [
            {
              type: "created",
              description: "Дело создано",
              timestamp: new Date("2025-05-18T09:15:00"),
              user: "Анна Смирнова",
            },
            {
              type: "ai_analysis",
              description: "Система выявила 1 проблему и 3 предупреждения",
              timestamp: new Date("2025-05-18T09:17:00"),
              user: "Система",
            },
          ],
        },
      },
    ])

    // Create documents for each case
    const documents = []

    // Documents for case 1
    documents.push(
      await Document.create({
        name: "Официальное_приглашение.pdf",
        type: "application/pdf",
        size: 2300000,
        path: "/uploads/sample/invitation.pdf",
        caseId: cases[0]._id,
        status: "uploaded",
        createdAt: new Date("2025-05-20T10:20:00"),
      }),
      await Document.create({
        name: "Список_участников.xlsx",
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: 1800000,
        path: "/uploads/sample/participants.xlsx",
        caseId: cases[0]._id,
        status: "uploaded",
        createdAt: new Date("2025-05-20T10:20:00"),
      }),
      await Document.create({
        name: "Договор_с_транспортной_компанией.pdf",
        type: "application/pdf",
        size: 3500000,
        path: "/uploads/sample/transport_contract.pdf",
        caseId: cases[0]._id,
        status: "uploaded",
        createdAt: new Date("2025-05-20T10:20:00"),
      }),
      await Document.create({
        name: "Договор_с_гостиницей.pdf",
        type: "application/pdf",
        size: 2700000,
        path: "/uploads/sample/hotel_contract.pdf",
        caseId: cases[0]._id,
        status: "uploaded",
        createdAt: new Date("2025-05-20T10:20:00"),
      }),
      await Document.create({
        name: "Медицинские_справки_участников.pdf",
        type: "application/pdf",
        size: 5100000,
        path: "/uploads/sample/medical_certificates.pdf",
        caseId: cases[0]._id,
        status: "missing",
        createdAt: new Date("2025-05-20T10:20:00"),
      }),
      await Document.create({
        name: "Согласия_родителей.pdf",
        type: "application/pdf",
        size: 4200000,
        path: "/uploads/sample/parent_consents.pdf",
        caseId: cases[0]._id,
        status: "missing",
        createdAt: new Date("2025-05-20T10:20:00"),
      }),
      await Document.create({
        name: "Страховые_полисы_участников.pdf",
        type: "application/pdf",
        size: 3800000,
        path: "/uploads/sample/insurance.pdf",
        caseId: cases[0]._id,
        status: "missing",
        createdAt: new Date("2025-05-20T10:20:00"),
      }),
    )

    // Update case 1 with document IDs
    await Case.findByIdAndUpdate(cases[0]._id, {
      documents: documents.slice(0, 7).map((doc) => doc._id),
    })

    // Documents for case 2
    documents.push(
      await Document.create({
        name: "Приглашение_от_музея.pdf",
        type: "application/pdf",
        size: 1500000,
        path: "/uploads/sample/museum_invitation.pdf",
        caseId: cases[1]._id,
        status: "uploaded",
        createdAt: new Date("2025-05-19T14:25:00"),
      }),
      await Document.create({
        name: "Список_учеников.xlsx",
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: 1200000,
        path: "/uploads/sample/students_list.xlsx",
        caseId: cases[1]._id,
        status: "uploaded",
        createdAt: new Date("2025-05-19T14:25:00"),
      }),
      await Document.create({
        name: "Договор_с_транспортной_компанией.pdf",
        type: "application/pdf",
        size: 2200000,
        path: "/uploads/sample/transport_contract_2.pdf",
        caseId: cases[1]._id,
        status: "uploaded",
        createdAt: new Date("2025-05-19T14:25:00"),
      }),
      await Document.create({
        name: "Согласия_родителей.pdf",
        type: "application/pdf",
        size: 3100000,
        path: "/uploads/sample/parent_consents_2.pdf",
        caseId: cases[1]._id,
        status: "missing",
        createdAt: new Date("2025-05-19T14:25:00"),
      }),
      await Document.create({
        name: "Страховые_полисы.pdf",
        type: "application/pdf",
        size: 2800000,
        path: "/uploads/sample/insurance_2.pdf",
        caseId: cases[1]._id,
        status: "missing",
        createdAt: new Date("2025-05-19T14:25:00"),
      }),
    )

    // Update case 2 with document IDs
    await Case.findByIdAndUpdate(cases[1]._id, {
      documents: documents.slice(7, 12).map((doc) => doc._id),
    })

    // Documents for case 3
    documents.push(
      await Document.create({
        name: "Программа_лагеря.pdf",
        type: "application/pdf",
        size: 2500000,
        path: "/uploads/sample/camp_program.pdf",
        caseId: cases[2]._id,
        status: "uploaded",
        createdAt: new Date("2025-05-18T09:10:00"),
      }),
      await Document.create({
        name: "Список_участников.xlsx",
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: 1600000,
        path: "/uploads/sample/camp_participants.xlsx",
        caseId: cases[2]._id,
        status: "uploaded",
        createdAt: new Date("2025-05-18T09:10:00"),
      }),
      await Document.create({
        name: "Договор_с_базой_отдыха.pdf",
        type: "application/pdf",
        size: 3200000,
        path: "/uploads/sample/resort_contract.pdf",
        caseId: cases[2]._id,
        status: "uploaded",
        createdAt: new Date("2025-05-18T09:10:00"),
      }),
      await Document.create({
        name: "Договор_с_транспортной_компанией.pdf",
        type: "application/pdf",
        size: 2900000,
        path: "/uploads/sample/transport_contract_3.pdf",
        caseId: cases[2]._id,
        status: "uploaded",
        createdAt: new Date("2025-05-18T09:10:00"),
      }),
      await Document.create({
        name: "Согласия_родителей.pdf",
        type: "application/pdf",
        size: 4500000,
        path: "/uploads/sample/parent_consents_3.pdf",
        caseId: cases[2]._id,
        status: "uploaded",
        createdAt: new Date("2025-05-18T09:10:00"),
      }),
      await Document.create({
        name: "Страховые_полисы.pdf",
        type: "application/pdf",
        size: 3700000,
        path: "/uploads/sample/insurance_3.pdf",
        caseId: cases[2]._id,
        status: "uploaded",
        createdAt: new Date("2025-05-18T09:10:00"),
      }),
      await Document.create({
        name: "Медицинские_справки.pdf",
        type: "application/pdf",
        size: 5200000,
        path: "/uploads/sample/medical_certificates_3.pdf",
        caseId: cases[2]._id,
        status: "missing",
        createdAt: new Date("2025-05-18T09:10:00"),
      }),
    )

    // Update case 3 with document IDs
    await Case.findByIdAndUpdate(cases[2]._id, {
      documents: documents.slice(12, 19).map((doc) => doc._id),
    })

    console.log("Database seeded successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
