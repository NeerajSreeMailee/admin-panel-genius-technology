"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Loader2 } from "lucide-react"
import { updateProduct } from "@/lib/firebase-data"
import { toast } from "sonner"
import type { Product } from "@/components/tables"

const productFormSchema = z.object({
  title: z.string().min(2, {
    message: "Product title must be at least 2 characters.",
  }),
  brand: z.string().min(1, {
    message: "Brand is required.",
  }),
  category: z.string().min(1, {
    message: "Category is required.",
  }),
  type: z.string().min(1, {
    message: "Type is required.",
  }),
  price: z.number().min(0, {
    message: "Price must be a positive number.",
  }),
  available_quantity: z.number().min(0, {
    message: "Quantity must be a positive number.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  images: z.array(z.string().url()).optional(),
})

type ProductFormValues = z.infer<typeof productFormSchema>

interface EditProductFormProps {
  product: Product
  onSuccess?: () => void
  onCancel?: () => void
}

export function EditProductForm({ product, onSuccess, onCancel }: EditProductFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>(product.images || [])
  const [newImageUrl, setNewImageUrl] = useState("")
  const router = useRouter()

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: product.title,
      brand: product.brand,
      category: product.category,
      type: product.type,
      price: product.price,
      available_quantity: product.available_quantity,
      description: product.description,
      images: product.images || [],
    },
  })

  useEffect(() => {
    setImageUrls(product.images || [])
    form.setValue("images", product.images || [])
  }, [product, form])

  const addImageUrl = () => {
    if (newImageUrl.trim() && !imageUrls.includes(newImageUrl.trim())) {
      const updatedUrls = [...imageUrls, newImageUrl.trim()]
      setImageUrls(updatedUrls)
      form.setValue("images", updatedUrls)
      setNewImageUrl("")
    }
  }

  const removeImageUrl = (index: number) => {
    const updatedUrls = imageUrls.filter((_, i) => i !== index)
    setImageUrls(updatedUrls)
    form.setValue("images", updatedUrls)
  }

  async function onSubmit(data: ProductFormValues) {
    setIsLoading(true)
    try {
      await updateProduct(product.id, {
        ...data,
        images: imageUrls,
      })
      
      toast.success("Product updated successfully!")
      onSuccess?.()
      router.refresh()
    } catch (error) {
      console.error("Error updating product:", error)
      toast.error("Failed to update product. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Product</CardTitle>
        <CardDescription>
          Update product information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Title</FormLabel>
                    <FormControl>
                      <Input placeholder="iPhone 15 Pro Max" {...field} disabled />
                    </FormControl>
                    <FormDescription>
                      Title cannot be changed (it's the document ID)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input placeholder="Apple" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Battery">Battery</SelectItem>
                        <SelectItem value="Display">Display</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Apple">Apple</SelectItem>
                        <SelectItem value="OPPO">OPPO</SelectItem>
                        <SelectItem value="Samsung">Samsung</SelectItem>
                        <SelectItem value="Vivo">Vivo</SelectItem>
                        <SelectItem value="Mi">Mi</SelectItem>
                        <SelectItem value="Infinix">Infinix</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₹)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="1299" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="available_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Quantity</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="50" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Detailed product description..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image URLs Section */}
            <div className="space-y-4">
              <FormLabel>Product Images</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
                />
                <Button type="button" onClick={addImageUrl} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {imageUrls.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Added Images:</p>
                  <div className="flex flex-wrap gap-2">
                    {imageUrls.map((url, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        <span className="max-w-[200px] truncate">{url}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => removeImageUrl(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Product
              </Button>
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}