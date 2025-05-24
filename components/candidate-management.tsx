"use client"

import type React from "react"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Trash2, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"

const candidateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  portfolio: z.string().min(1, "Portfolio is required"),
  image: z.any().optional(),
  bio: z.string().optional(),
})

const candidatesFormSchema = z.object({
  candidates: z.array(candidateSchema).min(1, "At least one candidate is required"),
})

type CandidatesFormData = z.infer<typeof candidatesFormSchema>

const portfolios = [
  "Student Council President",
  "Vice President",
  "Secretary",
  "Treasurer",
  "Sports Captain",
  "Head Boy/Girl",
  "Class Representative",
  "Library Prefect",
]

export function CandidateManagement() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<CandidatesFormData>({
    resolver: zodResolver(candidatesFormSchema),
    defaultValues: {
      candidates: [
        {
          firstName: "",
          middleName: "",
          lastName: "",
          portfolio: "",
          bio: "",
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "candidates",
  })

  const handleImageUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setValue(`candidates.${index}.image`, file)
    }
  }

  const onSubmit = async (data: CandidatesFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Candidates data:", data)

      setSuccess(`Successfully added ${data.candidates.length} candidate(s)!`)
      reset()
    } catch (err) {
      setError("Failed to add candidates. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const addCandidate = () => {
    append({
      firstName: "",
      middleName: "",
      lastName: "",
      portfolio: "",
      bio: "",
    })
  }

  return (
    <div className="space-y-6">
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Add Candidates</CardTitle>
          <CardDescription>
            Add multiple candidates at once. You can add candidates for different portfolios in a single submission.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
              {fields.map((field, index) => (
                <Card key={field.id} className="relative">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Candidate {index + 1}</CardTitle>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => remove(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`candidates.${index}.firstName`}>First Name *</Label>
                        <Input
                          {...register(`candidates.${index}.firstName`)}
                          placeholder="Enter first name"
                          className={errors.candidates?.[index]?.firstName ? "border-red-500" : ""}
                        />
                        {errors.candidates?.[index]?.firstName && (
                          <p className="text-sm text-red-500">{errors.candidates[index]?.firstName?.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`candidates.${index}.middleName`}>Middle Name</Label>
                        <Input
                          {...register(`candidates.${index}.middleName`)}
                          placeholder="Enter middle name (optional)"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`candidates.${index}.lastName`}>Last Name *</Label>
                        <Input
                          {...register(`candidates.${index}.lastName`)}
                          placeholder="Enter last name"
                          className={errors.candidates?.[index]?.lastName ? "border-red-500" : ""}
                        />
                        {errors.candidates?.[index]?.lastName && (
                          <p className="text-sm text-red-500">{errors.candidates[index]?.lastName?.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`candidates.${index}.portfolio`}>Portfolio *</Label>
                        <Select
                          value={watch(`candidates.${index}.portfolio`)}
                          onValueChange={(value) => setValue(`candidates.${index}.portfolio`, value)}
                        >
                          <SelectTrigger className={errors.candidates?.[index]?.portfolio ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select portfolio" />
                          </SelectTrigger>
                          <SelectContent>
                            {portfolios.map((portfolio) => (
                              <SelectItem key={portfolio} value={portfolio}>
                                {portfolio}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.candidates?.[index]?.portfolio && (
                          <p className="text-sm text-red-500">{errors.candidates[index]?.portfolio?.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`candidates.${index}.image`}>Candidate Photo</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(index, e)}
                            className="hidden"
                            id={`image-${index}`}
                          />
                          <Label
                            htmlFor={`image-${index}`}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                          >
                            <Upload className="h-4 w-4" />
                            Upload Photo
                          </Label>
                        </div>
                      </div>
                    </div>

                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <Button type="button" variant="outline" onClick={addCandidate} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Another Candidate
              </Button>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => reset()} disabled={isLoading}>
                  Reset Form
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Adding Candidates..." : `Add ${fields.length} Candidate(s)`}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
