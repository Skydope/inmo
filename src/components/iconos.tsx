"use client"

import {
  ArrowCounterClockwise as ArrowCounterClockwiseIcon,
  ArrowsOut as ArrowsOutIcon,
  ArrowUpRight as ArrowUpRightIcon,
  Bathtub as BathtubIcon,
  Bed as BedIcon,
  Briefcase as BriefcaseIcon,
  Building as BuildingIcon,
  Buildings as BuildingsIcon,
  Calendar as CalendarIcon,
  Car as CarIcon,
  Certificate as CertificateIcon,
  CaretDown as CaretDownIcon,
  CaretLeft as CaretLeftIcon,
  CaretRight as CaretRightIcon,
  CaretUp as CaretUpIcon,
  CurrencyCircleDollar as CurrencyCircleDollarIcon,
  ChatCircle as ChatCircleIcon,
  Check as CheckIcon,
  Envelope as EnvelopeIcon,
  House as HouseIcon,
  Image as ImageIcon,
  Key as KeyIcon,
  List as ListIcon,
  MagnifyingGlass as MagnifyingGlassIcon,
  MapPin as MapPinIcon,
  MapTrifold as MapTrifoldIcon,
  Minus as MinusIcon,
  Path as PathIcon,
  Plus as PlusIcon,
  Phone as PhoneIcon,
  Polygon as PolygonIcon,
  Ruler as RulerIcon,
  SealCheck as SealCheckIcon,
  ShareNetwork as ShareNetworkIcon,
  SignOut as SignOutIcon,
  SlidersHorizontal as SlidersHorizontalIcon,
  Storefront as StorefrontIcon,
  TextT as TextTIcon,
  Tractor as TractorIcon,
  Trash as TrashIcon,
  Tree as TreeIcon,
  VideoCamera as VideoCameraIcon,
  Warehouse as WarehouseIcon,
  X as XIcon,
  type Icon,
  type IconProps,
} from "@phosphor-icons/react"

/** Trazo grueso: para lo que es una línea y no una forma (el menú, la cruz). Relleno los apelmaza. */
function trazo(Icono: Icon) {
  return function IconoTrazo(props: IconProps) {
    return <Icono {...props} weight="bold" />
  }
}

function relleno(Icono: Icon) {
  return function IconoRelleno(props: IconProps) {
    return <Icono {...props} weight="fill" />
  }
}

export const ArrowCounterClockwise = relleno(ArrowCounterClockwiseIcon)
export const ArrowsOut = relleno(ArrowsOutIcon)
export const ArrowUpRight = relleno(ArrowUpRightIcon)
export const Bathtub = relleno(BathtubIcon)
export const Bed = relleno(BedIcon)
export const Briefcase = relleno(BriefcaseIcon)
export const Building = relleno(BuildingIcon)
export const Buildings = relleno(BuildingsIcon)
export const Calendar = relleno(CalendarIcon)
export const Car = relleno(CarIcon)
export const Certificate = relleno(CertificateIcon)
export const CaretDown = relleno(CaretDownIcon)
export const CaretLeft = relleno(CaretLeftIcon)
export const CaretRight = relleno(CaretRightIcon)
export const CaretUp = relleno(CaretUpIcon)
export const CurrencyCircleDollar = relleno(CurrencyCircleDollarIcon)
export const ChatCircle = relleno(ChatCircleIcon)
export const Check = relleno(CheckIcon)
export const Envelope = relleno(EnvelopeIcon)
export const House = relleno(HouseIcon)
export const Image = relleno(ImageIcon)
export const Key = relleno(KeyIcon)
export const List = trazo(ListIcon)
export const MagnifyingGlass = relleno(MagnifyingGlassIcon)
export const MapPin = relleno(MapPinIcon)
export const MapTrifold = relleno(MapTrifoldIcon)
export const Minus = relleno(MinusIcon)
export const Path = relleno(PathIcon)
export const Plus = relleno(PlusIcon)
export const Phone = relleno(PhoneIcon)
export const Polygon = relleno(PolygonIcon)
export const Ruler = relleno(RulerIcon)
export const SealCheck = relleno(SealCheckIcon)
export const ShareNetwork = relleno(ShareNetworkIcon)
export const SignOut = relleno(SignOutIcon)
export const SlidersHorizontal = relleno(SlidersHorizontalIcon)
export const Storefront = relleno(StorefrontIcon)
export const TextT = relleno(TextTIcon)
export const Tractor = relleno(TractorIcon)
export const Trash = relleno(TrashIcon)
export const Tree = relleno(TreeIcon)
export const VideoCamera = relleno(VideoCameraIcon)
export const Warehouse = relleno(WarehouseIcon)
export const X = trazo(XIcon)

/** Nombres que ya usaba la taxonomía. El dibujo es Phosphor relleno. */
export const Building2 = relleno(BuildingsIcon)
export const Trees = relleno(TreeIcon)
export const LandPlot = relleno(PolygonIcon)
export const CarFront = relleno(CarIcon)

export type { IconProps }
