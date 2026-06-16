'use client'

import { useMemo, useState } from 'react'
import { Calculator, FileDown, PanelsTopLeft, Package, Pencil, Sigma, SlidersHorizontal } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  amjLines,
  gsmodSeedLines,
  lineAmount,
  perth200Inputs,
  ProjectInputs,
  ProjectQuantityKey,
  QuoteLine,
  rmbToAud,
  traditionalRawlinsonsLines,
} from '@/lib/quotation-model'

const aud = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 })
const rmb = new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', maximumFractionDigits: 0 })

const inputFields: Array<{ key: ProjectQuantityKey; label: string; unit: string }> = [
  { key: 'dwellingAreaM2', label: 'Dwelling area', unit: 'm2' },
  { key: 'buildAreaM2', label: 'Build area', unit: 'm2' },
  { key: 'totalCostingAreaM2', label: 'Quoted costing area', unit: 'm2' },
  { key: 'carportAreaM2', label: 'Carport', unit: 'm2' },
  { key: 'alfrescoPorchAreaM2', label: 'Alfresco + porch', unit: 'm2' },
  { key: 'wetAreaM2', label: 'Wet floor area', unit: 'm2' },
  { key: 'externalWallM2', label: 'External wall takeoff', unit: 'm2' },
  { key: 'internalDryWallM2', label: 'Internal dry wall', unit: 'm2' },
  { key: 'wetWallTileM2', label: 'Wet wall/tile area', unit: 'm2' },
  { key: 'roofAreaM2', label: 'Roof area', unit: 'm2' },
  { key: 'windowAreaM2', label: 'Window/glazing area', unit: 'm2' },
  { key: 'containerCount', label: 'Shipping containers', unit: 'count' },
  { key: 'moduleCount', label: 'GSMOD pods/modules', unit: 'count' },
  { key: 'exchangeRateRmbToAud', label: 'RMB to AUD', unit: 'rate' },
]

function QuoteTable({ lines, inputs }: { lines: QuoteLine[]; inputs: ProjectInputs }) {
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500">
          <tr>
            <th className="text-left font-medium px-3 py-2">Category</th>
            <th className="text-left font-medium px-3 py-2">Item</th>
            <th className="text-right font-medium px-3 py-2">Qty</th>
            <th className="text-left font-medium px-3 py-2">Unit</th>
            <th className="text-right font-medium px-3 py-2">Rate</th>
            <th className="text-right font-medium px-3 py-2">Amount</th>
            <th className="text-left font-medium px-3 py-2">Basis</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {lines.map((line) => {
            const qty = line.driver === 'fixed' ? line.quantity : inputs[line.driver]
            const amount = lineAmount(line, inputs)
            return (
              <tr key={line.id} className="align-top">
                <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{line.category}</td>
                <td className="px-3 py-2 text-gray-900 min-w-60">{line.item}</td>
                <td className="px-3 py-2 text-right tabular-nums">{qty.toLocaleString('en-AU', { maximumFractionDigits: 2 })}</td>
                <td className="px-3 py-2 text-gray-500">{line.unit}</td>
                <td className="px-3 py-2 text-right tabular-nums">{line.currency === 'AUD' ? aud.format(line.rate) : rmb.format(line.rate)}</td>
                <td className="px-3 py-2 text-right font-medium tabular-nums">{line.currency === 'AUD' ? aud.format(amount) : rmb.format(amount)}</td>
                <td className="px-3 py-2 text-gray-500">{line.confidence}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function totalRmb(lines: QuoteLine[], inputs: ProjectInputs) {
  return lines.filter((line) => line.currency === 'RMB').reduce((sum, line) => sum + lineAmount(line, inputs), 0)
}

export function QuotationEstimator() {
  const [inputs, setInputs] = useState<ProjectInputs>(perth200Inputs)

  const totals = useMemo(() => {
    const amjRmb = totalRmb(amjLines, inputs)
    const gsmodRmb = totalRmb(gsmodSeedLines, inputs)
    const traditionalLow = inputs.totalCostingAreaM2 * traditionalRawlinsonsLines[0].rate
    const traditionalHigh = inputs.totalCostingAreaM2 * traditionalRawlinsonsLines[1].rate

    return {
      traditionalLow,
      traditionalHigh,
      amjRmb,
      amjAud: rmbToAud(amjRmb, inputs),
      gsmodRmb,
      gsmodAud: rmbToAud(gsmodRmb, inputs),
    }
  }, [inputs])

  const setNumericInput = (key: ProjectQuantityKey, value: string) => {
    const parsed = Number(value)
    if (Number.isNaN(parsed)) return
    setInputs((current) => ({ ...current, [key]: parsed }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-amber-600">Autoquotation model</p>
          <h2 className="text-2xl font-bold text-gray-900">Perth200 calibration workspace</h2>
          <p className="mt-1 max-w-3xl text-sm text-gray-500">
            Seed model for comparing traditional build costing, AMJ panelised light-gauge steel, and GSMOD pod/container modular construction.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="gap-2"><Pencil className="h-4 w-4" /> Edit seed rates</Button>
          <Button className="gap-2"><FileDown className="h-4 w-4" /> Export quote</Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base"><Calculator className="h-4 w-4 text-amber-600" /> Traditional</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{aud.format(totals.traditionalLow)} - {aud.format(totals.traditionalHigh)}</p>
            <p className="mt-1 text-sm text-gray-500">Rawlinsons 2024 Perth benchmark band, still class-dependent.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base"><PanelsTopLeft className="h-4 w-4 text-amber-600" /> AMJ panel modular</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{rmb.format(totals.amjRmb)}</p>
            <p className="mt-1 text-sm text-gray-500">{aud.format(totals.amjAud)} at RMB/AUD {inputs.exchangeRateRmbToAud.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base"><Package className="h-4 w-4 text-amber-600" /> GSMOD pods</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">{rmb.format(totals.gsmodRmb)}</p>
            <p className="mt-1 text-sm text-gray-500">{aud.format(totals.gsmodAud)} manual seed until OCR calibration.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><SlidersHorizontal className="h-4 w-4 text-amber-600" /> Project takeoffs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {inputFields.map((field) => (
              <label key={field.key} className="grid grid-cols-[1fr_120px] items-center gap-3 text-sm">
                <span className="text-gray-600">{field.label}</span>
                <div className="relative">
                  <Input
                    type="number"
                    value={inputs[field.key] as number}
                    onChange={(event) => setNumericInput(field.key, event.target.value)}
                    className="pr-12 text-right"
                    step={field.key === 'exchangeRateRmbToAud' ? '0.01' : '1'}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{field.unit}</span>
                </div>
              </label>
            ))}
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
              Drawing extraction found 164 m2 build area, 147 m2 dwelling, 17 m2 alfresco/porch, 31-32 m2 carport and 200 m2 quoted total area. AMJ quote extraction matched RMB 505,954.
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="amj" className="min-w-0">
          <TabsList className="w-full flex-wrap h-auto justify-start">
            <TabsTrigger value="traditional">Traditional</TabsTrigger>
            <TabsTrigger value="amj">AMJ line items</TabsTrigger>
            <TabsTrigger value="gsmod">GSMOD seed</TabsTrigger>
            <TabsTrigger value="method">Method</TabsTrigger>
          </TabsList>

          <TabsContent value="traditional">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Classical build cost reference</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <QuoteTable lines={traditionalRawlinsonsLines} inputs={inputs} />
                <p className="text-sm text-gray-500">
                  This is deliberately a benchmark range only. The next calibration step is to map the architectural class to the correct Rawlinsons row, then add preliminaries, services, external works, margins and escalation explicitly.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="amj">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base"><Sigma className="h-4 w-4 text-amber-600" /> AMJ extracted quotation model</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <QuoteTable lines={amjLines} inputs={inputs} />
                <div className="flex flex-wrap justify-end gap-4 text-sm">
                  <span className="text-gray-500">Extracted total: RMB 505,954</span>
                  <span className="font-semibold text-gray-900">Model total: {rmb.format(totals.amjRmb)}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gsmod">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">GSMOD pod/container model seed</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <QuoteTable lines={gsmodSeedLines} inputs={inputs} />
                <p className="text-sm text-gray-500">
                  The supplied GSMOD quotation PDF did not expose text or table data to local extraction. These lines are placeholders shaped around the expected modular cost drivers: factory module area, wet-room fitout, container logistics, module setting and local works.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="method">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Estimator model notes</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                {[
                  ['Drawing parser target', 'Extract gross areas, room/wet area, wall lengths, roof area, window schedule, door counts, bathroom count and module/container assumptions.'],
                  ['AMJ model', 'Best current calibration. Rates and quantities are extracted from the Perth200 quote, with drivers mapped to reusable takeoff fields.'],
                  ['GSMOD model', 'Needs OCR/manual quote capture. UI is ready for calibration once totals and line items are readable.'],
                  ['Traditional model', 'Rawlinsons reference is present locally, but the selected class must be confirmed before treating the output as a QS-grade estimate.'],
                ].map(([title, body]) => (
                  <div key={title} className="rounded-lg border border-gray-200 bg-white p-4">
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-gray-500">{body}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
