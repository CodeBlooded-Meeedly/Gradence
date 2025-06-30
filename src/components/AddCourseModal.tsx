import { useEffect, useState } from 'react'
import CreatableSelect from 'react-select/creatable';
import { customSingleSelectStyle } from '../lib/styleUtils';
import { supabase } from '../lib/supabase';
import { type Subject } from '../lib/supabase';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    schools: string[];
    majors: string[];
};

type OptionType = { label: string; value: string };


export default function AddCourseModal({isOpen, onClose, onSubmit, schools, majors}: ModalProps) {
    if (!isOpen) return null;

    const schoolOptions: OptionType[] = schools.map(s => ({ value: s, label: s }))
    const majorOptions: OptionType[] = majors.map(m => ({value: m, label: m}))

    const [courseName, setCourseName] = useState<string | null>()
    const [major, setMajor] = useState<OptionType | null>()
    const [school, setSchool] = useState<OptionType | null>()
    const [filled, setFilled] = useState<boolean>(false)
    const [subjectList, setSubjectList] = useState<Subject[]>([])

    const notEmpty = (value: any) => {
        if (typeof(value) === 'string') {
            return value !== null && value !== undefined && value.trim() !== "";
        }
        return value !== null && value !== undefined
    }

    const loadSubjects = async () => {
        try {
            const { data, error } = await supabase
                .from('subjects')
                .select('*')
                .order('created_at', { ascending: true })
            if (error) throw error
            
            // convert all data to lowercase for easier matching
            const lowercasedData = data.map(s => ({
                ...s,
                name: s.name.toLowerCase().trim(),
                major: s.major ? s.major.toLowerCase().trim() : null,
                university: s.university ? s.university.toLowerCase().trim() : null
            }))
            setSubjectList(lowercasedData)

        } catch (err) {
            console.error('Error loading subjects:', err)
        }
    }

    useEffect(() => {
        loadSubjects()
    }, [])

    useEffect(() => {
        setFilled(!!(notEmpty(courseName) && notEmpty(major) && notEmpty(school)))
    }, [courseName, major, school])
 
    const handleNewSchool =(inputValue: string) => {
        const newOption = { value: inputValue, label: inputValue };
        setSchool(newOption);
    }

    const handleNewMajor = (inputValue: string) => {
        const newOption = { value: inputValue, label: inputValue };
        setMajor(newOption);
    }

    const handleSubmit = async() => {
        // check if course already exists for this school
        if (subjectList.some(s => { 
            return (courseName?.trim().toLowerCase() == s.name) && 
            (school?.value.trim().toLowerCase() == s.university)}
        )) {
            alert('This course already exists for the selected school!')
            return null
        }

        const coursePayload = {
            name: courseName,
            university: school?.value,
            major: major?.value
        }

        const { error: err } = await supabase
            .from('subjects')
            .insert(coursePayload)
            .select()

        if (err) {
            console.error('error submitting subject')
            return
        }

        alert('Course added successfully!')
        onSubmit()
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-[#2a2a2a] p-6 rounded-xl shadow-xl relative w-2/3">
                <h2 className="text-2xl font-bold text-gradient mb-2">Add a Course</h2>

                <br />

                <h3 className='mb-2'>Course Name*</h3>
                <input 
                    type="text"
                    placeholder='Course name'
                    onChange={(e) => setCourseName(e.target.value)}
                    className="rounded-md px-4 py-2 w-full mb-6"
                />

                <h3 className='mb-2'>School*</h3>
                <CreatableSelect 
                    styles={customSingleSelectStyle}
                    value={school}
                    onChange={(s: OptionType | null) => {setSchool(s)}}
                    onCreateOption={handleNewSchool}
                    options={schoolOptions}
                    placeholder='Find school'
                    isClearable
                    className='mb-6'
                />

                <h3 className='mb-2'>Major*</h3>
                <CreatableSelect
                    styles={customSingleSelectStyle}
                    value={major}
                    onChange={(m: OptionType | null) => {setMajor(m)}}
                    onCreateOption={handleNewMajor}
                    options={majorOptions}
                    placeholder='Select major'
                    isClearable
                    className='mb-6'
                />

                <br />

                <div className='flex justify-end'>
                    <button className='flex bg-[#3b3b3b] justify-center mr-4 w-1/3' onClick={onClose}>Close</button>
                    <button className='flex bg-[#d985ea] justify-center w-1/3 disabled:bg-[#5f3a6b] disabled:cursor-not-allowed' disabled={!filled} onClick={handleSubmit}>Submit</button>
                </div>
                
            </div>
        </div>
    );
}