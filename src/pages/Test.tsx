import { useState } from "react";
import {
    BsFillHeartPulseFill,
    BsWind,
    BsHandIndex,
    BsSpeedometer2,
    BsActivity,
    BsThermometerHalf,
    BsDropletFill,
    BsShieldExclamation,
    BsBandaid,
    BsExclamationTriangle,
    BsFire,
    BsLightningFill,
    BsQuestionCircle,
    BsEyeFill,
    BsEarFill,
    BsChatDotsFill,
    BsLifePreserver,
    BsCapsulePill,
    BsBellFill,
    BsThreeDots,
    BsCheckLg
} from "react-icons/bs";
import { FaBrain } from "react-icons/fa";
import { IconType } from "react-icons";

interface ComplaintFamily {
    id: string;
    label: string;
    description: string;
    icon: IconType;
}

export default function Test() {
    const [selectedComplaints, setSelectedComplaints] = useState<string[]>([]);
    const [hoveredComplaint, setHoveredComplaint] = useState<ComplaintFamily | null>(null);

    const complaintFamilies: ComplaintFamily[] = [
        { id: "chest_pain", label: "Chest pain", description: "Pain, tightness, pressure in the chest", icon: BsFillHeartPulseFill },
        { id: "shortness_of_breath", label: "Shortness of breath", description: "Breathlessness, wheeze, difficulty breathing", icon: BsWind },
        { id: "abdominal_pain", label: "Abdominal pain", description: "Stomach/abdominal pain anywhere", icon: BsHandIndex },
        { id: "headache", label: "Headache", description: "New, severe, or worsening headache", icon: FaBrain },
        { id: "dizziness_collapse", label: "Dizziness / fainting", description: "Dizzy, lightheaded, fainted or nearly fainted", icon: BsSpeedometer2 },
        { id: "palpitations", label: "Palpitations", description: "Racing or irregular heartbeat", icon: BsActivity },

        { id: "fever_flu_like", label: "Fever / flu-like illness", description: "Fever, chills, aches, feeling generally unwell", icon: BsThermometerHalf },
        { id: "vomiting_diarrhoea", label: "Vomiting / diarrhoea", description: "Vomiting and/or diarrhoea", icon: BsDropletFill },
        { id: "possible_infection", label: "Possible infection", description: "Local infection (skin), urinary infection symptoms, or concern for infection", icon: BsShieldExclamation },

        { id: "injury_trauma", label: "Injury / trauma", description: "Fall, cut, sprain, accident, injury", icon: BsBandaid },
        { id: "head_injury", label: "Head injury", description: "Hit head, concussion symptoms, head wound", icon: FaBrain },
        { id: "burns", label: "Burns", description: "Thermal, chemical, or electrical burn", icon: BsFire },

        { id: "weakness_numbness", label: "Weakness / numbness", description: "New weakness, numbness, facial droop, or tingling", icon: BsHandIndex },
        { id: "seizure", label: "Seizure / fitting", description: "Seizure, convulsions, or post-seizure state", icon: BsLightningFill },
        { id: "confusion_altered", label: "Confusion / drowsiness", description: "New confusion, very drowsy, not acting normally", icon: BsQuestionCircle },

        { id: "eye_problem", label: "Eye problem", description: "Vision loss, eye pain, redness, eye injury", icon: BsEyeFill },
        { id: "ent_problem", label: "Ear / nose / throat problem", description: "Sore throat, ear pain, nosebleed, sinus issues", icon: BsEarFill },

        { id: "urinary_problem", label: "Urinary problem", description: "Pain passing urine, retention, blood in urine", icon: BsDropletFill },
        { id: "testicular_scrotal_pain", label: "Testicular / scrotal pain", description: "Pain or swelling in testicles/scrotum", icon: BsExclamationTriangle },
        { id: "vaginal_bleeding_pelvic_pain", label: "Vaginal bleeding / pelvic pain", description: "Bleeding, pelvic pain, pregnancy concerns", icon: BsExclamationTriangle },

        { id: "mental_health", label: "Mental health concern", description: "Anxiety, low mood, psychosis, distress", icon: BsChatDotsFill },
        { id: "self_harm_suicidal", label: "Self-harm / suicidal thoughts", description: "Self-harm or thoughts of suicide", icon: BsLifePreserver },

        { id: "medication_problem", label: "Medication problem", description: "Side effects, missed doses, accidental overdose", icon: BsCapsulePill },
        { id: "allergic_reaction", label: "Allergic reaction", description: "Rash, itching, swelling (not severe right now)", icon: BsBellFill },

    ];

    const toggleComplaint = (id: string) => {
        setSelectedComplaints(prev =>
            prev.includes(id)
                ? prev.filter(c => c !== id)
                : [...prev, id]
        );
    };

    const isSelected = (id: string) => selectedComplaints.includes(id);

    return (
        <div className="min-h-screen bg-nhs flex flex-col items-center justify-center font-['Inter'] p-8 w-full ">


            <div className="flex flex-col items-start justify-center gap-4 grid-rows-1 pl-0 w-[80%]">
                <div className="">
                    <p className="text-white text-6xl font-medium text-start">
                        Chief Complaint
                    </p>
                    <p className="text-white text-3xl font-light italic mb-2 text-start">
                        Please Choose Categories That Apply
                    </p>
                </div>
                <div className="flex flex-col items-center justify-center w-full mt-6 ">
                    <div className="grid grid-cols-3 gap-4 w-[90%]">
                        {complaintFamilies.slice(0, 6).map((complaint: ComplaintFamily) => (
                            <ComplaintCard key={complaint.id} complaint={complaint} />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

const ComplaintCard = ({ complaint }: { complaint: ComplaintFamily }) => {
    return (
        <div className="flex flex-col items-start justify-center w-full selection:bg-sky-200 bg-sky-200/50 hover:cursor-pointer hover:scale-[1.01] hover:bg-sky-200/70 ease-in-out transition-all duration-300 rounded-lg p-4 px-3">
            <div className="flex flex-row items-start justify-center gap-2">
                {complaint.icon && <complaint.icon className="text-black text-3xl" />}
                <p className="text-black text-lg font-medium text-start">{complaint.label}</p>
            </div>
            <div>
                <p className="text-black text-sm font-light text-start mt-[-2px]">{complaint.description}</p>
            </div>

        </div>
    );
}